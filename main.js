// อ่าน config
// import หรือ <script src="config.js"></script> ใน HTML

async function getData() {
  const res = await fetch(
    `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.filePath}`,
    { headers: { "Authorization": `Bearer ${CONFIG.token}` } }
  );
  const json = await res.json();
  const content = atob(json.content);
  return JSON.parse(content);
}

// ---- ใส่ saveData ที่นี่ ----
async function saveData(newData) {
  const getFile = await fetch(
    `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.filePath}`,
    { headers: { "Authorization": `Bearer ${CONFIG.token}` } }
  );

  const file = await getFile.json();

  await fetch(
    `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.filePath}`,
    {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${CONFIG.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "update data",
        content: btoa(JSON.stringify(newData, null, 2)),
        sha: file.sha
      })
    }
  );
}

// ตัวอย่างฟังก์ชันยืมร่ม
async function borrow(id, borrowerName) {
  const data = await getData();
  const item = data.umbrellas.find(u => u.id === id);
  if (!item) { alert("ไม่พบร่ม"); return; }
  if (item.status === "borrowed") { alert("ร่มถูกยืมแล้ว"); return; }

  item.status = "borrowed";
  item.borrower = borrowerName;
  item.time = new Date().toISOString();

  await saveData(data); // <-- เรียกฟังก์ชัน saveData
  alert("ยืมร่มสำเร็จ!");
}

// ตัวอย่างคืนร่ม
async function returns(id) {
  const data = await getData();
  const item = data.umbrellas.find(u => u.id === id);
  if (!item) { alert("ไม่พบร่ม"); return; }

  item.status = "available";
  item.borrower = "";
  item.time = "";

  await saveData(data);
  alert("คืนร่มสำเร็จ!");
}
