# 📝 Rich Text Editor - Problem Based Learning

## ✨ Fitur Editor yang Telah Dibuat

### 🎨 **Tampilan Modern & Profesional**

Editor jawaban PBL sekarang memiliki tampilan yang:
- ✅ Modern seperti Google Form / LMS profesional
- ✅ Toolbar horizontal dengan ikon yang jelas
- ✅ Area penulisan yang luas dan nyaman
- ✅ Konsisten dengan tema website (warna emas #D4AF37)
- ✅ Responsive di semua device

---

## 🛠️ **Toolbar Features**

### **Format Teks**
- **Bold (B)** - Tebalkan teks (Ctrl+B)
- **Italic (I)** - Miringkan teks (Ctrl+I)
- **Underline (U)** - Garis bawah teks (Ctrl+U)

### **Alignment**
- **⬅ Rata Kiri** - Align text to left
- **↔ Rata Tengah** - Center align
- **➡ Rata Kanan** - Align text to right

### **List**
- **≡ Bullet List** - Buat daftar dengan bullet
- **⋮ Numbered List** - Buat daftar bernomor

### **Insert**
- **🔗 Link** - Sisipkan hyperlink
- **😊 Emoji** - Tambahkan emoji (😊, 👍, 💡, ✨)

---

## 💾 **Auto-Save dengan localStorage**

### **Fitur Auto-Save:**
```javascript
// Otomatis save setiap ada perubahan
useEffect(() => {
  if (jawaban && pblId && currentSintaks && currentTahap) {
    const storageKey = `pbl_draft_${pblId}_${currentSintaks}_${currentTahap}`;
    localStorage.setItem(storageKey, jawaban);
  }
}, [jawaban, pblId, currentSintaks, currentTahap]);
```

### **Storage Key Pattern:**
```
pbl_draft_[pblId]_[sintaksNomor]_[tahapNomor]
```

**Contoh:**
- `pbl_draft_1_1_1` → PBL ID 1, Sintaks 1, Tahap 1
- `pbl_draft_1_2_3` → PBL ID 1, Sintaks 2, Tahap 3

### **Load Draft:**
Draft otomatis di-load ketika:
1. Pertama kali buka halaman
2. Pindah ke tahap lain yang belum submitted
3. Refresh halaman

---

## 🎯 **Cara Penggunaan**

### **1. Menulis Jawaban**
```
1. Klik di area editor (putih)
2. Mulai menulis
3. Gunakan toolbar untuk format teks
4. Jawaban otomatis tersimpan di localStorage
```

### **2. Format Teks**
```
1. Blok/select teks yang ingin diformat
2. Klik tombol toolbar (Bold, Italic, dll)
3. Atau gunakan keyboard shortcut (Ctrl+B, Ctrl+I, dll)
```

### **3. Insert Link**
```
1. Blok teks yang akan dijadikan link
2. Klik tombol 🔗
3. Masukkan URL di popup
4. Link otomatis terbuat
```

### **4. Tambah Emoji**
```
1. Letakkan cursor di posisi yang diingin
2. Klik emoji di toolbar
3. Emoji langsung muncul
```

---

## 📱 **Responsive Design**

### **Desktop (>968px)**
- Toolbar full dengan divider
- Editor tinggi 350px
- Semua tombol terlihat jelas

### **Tablet (768px - 968px)**
- Toolbar kompak
- Tombol lebih kecil (32px)
- Divider hidden
- Editor tinggi 250px

### **Mobile (<480px)**
- Toolbar sangat kompak
- Tombol 28px
- Editor tinggi 200px
- Font size lebih kecil untuk readability

---

## 🎨 **Design System**

### **Warna**
```css
/* Primary (Gold) */
--primary: #D4AF37
--primary-dark: #C9A961
--primary-light: #FFF9E6

/* Neutral */
--bg-editor: #FFFFFF
--bg-toolbar: #F7FAFC
--border: #E2E8F0
--text: #2C3539
--text-secondary: #718096
--placeholder: #A0AEC0
```

### **Typography**
```css
/* Editor */
font-size: 15px (desktop)
font-size: 14px (tablet)
font-size: 13px (mobile)
line-height: 1.8
```

### **Spacing**
```css
/* Toolbar */
padding: 12px 16px (desktop)
padding: 10px 12px (tablet)
padding: 8px (mobile)

/* Editor Content */
padding: 20px (desktop)
padding: 16px (tablet)
padding: 12px (mobile)
```

### **Border Radius**
```css
/* Toolbar Top */
border-radius: 12px 12px 0 0

/* Editor Bottom */
border-radius: 0 0 12px 12px

/* Toolbar Buttons */
border-radius: 6px
```

---

## 💻 **Technical Implementation**

### **React Hooks Used**
```javascript
const editorRef = useRef(null);  // Reference to editor DOM

// Auto-save effect
useEffect(() => {
  // Save to localStorage on every change
}, [jawaban]);

// Load draft effect
useEffect(() => {
  // Load from localStorage on mount
}, [pblId, currentSintaks, currentTahap]);
```

### **Core Functions**
```javascript
// Execute formatting commands
const execCommand = (command, value = null) => {
  document.execCommand(command, false, value);
  setJawaban(editorRef.current.innerHTML);
};

// Handle editor input
const handleEditorInput = () => {
  setJawaban(editorRef.current.innerHTML);
};

// Insert link with prompt
const insertLink = () => {
  const url = prompt('Masukkan URL:');
  if (url) execCommand('createLink', url);
};

// Insert emoji directly
const insertEmoji = (emoji) => {
  document.execCommand('insertText', false, emoji);
  setJawaban(editorRef.current.innerHTML);
};
```

### **ContentEditable Implementation**
```jsx
<div
  ref={editorRef}
  className="editor-content"
  contentEditable={!isCompleted}
  onInput={handleEditorInput}
  onPaste={handleEditorPaste}
  data-placeholder="Tuliskan jawaban Anda..."
  suppressContentEditableWarning={true}
/>
```

---

## 🔄 **Data Flow**

### **Save Flow**
```
User types → onInput event → handleEditorInput()
→ setJawaban(innerHTML) → useEffect triggered
→ localStorage.setItem() → Data saved
```

### **Load Flow**
```
Component mount → useEffect triggered
→ localStorage.getItem() → Check if draft exists
→ setJawaban() → editorRef.current.innerHTML = draft
```

### **Submit Flow**
```
User clicks submit → handleSubmit()
→ Get innerHTML from editorRef
→ submitPBLTahap() with HTML content
→ Clear draft from localStorage
→ Navigate to next tahap
```

---

## 🚀 **Migration to Backend**

### **Current: localStorage**
```javascript
// Save
localStorage.setItem(storageKey, jawaban);

// Load
const draft = localStorage.getItem(storageKey);
```

### **Future: API Backend**
```javascript
// Save to API
const saveDraft = async () => {
  await fetch('/api/pbl/draft', {
    method: 'POST',
    body: JSON.stringify({
      pblId, sintaks, tahap, content: jawaban
    })
  });
};

// Load from API
const loadDraft = async () => {
  const response = await fetch(
    `/api/pbl/draft/${pblId}/${sintaks}/${tahap}`
  );
  const data = await response.json();
  setJawaban(data.content);
};
```

### **Struktur Data untuk Backend**
```json
{
  "userId": "student@email.com",
  "pblId": 1,
  "sintaksNomor": 1,
  "tahapNomor": 1,
  "content": "<p>Jawaban siswa dengan <strong>format</strong></p>",
  "files": [
    {
      "name": "gambar.jpg",
      "type": "image/jpeg",
      "data": "base64..."
    }
  ],
  "lastSaved": "2025-12-26T10:30:00Z",
  "isSubmitted": false
}
```

---

## 📊 **Features Comparison**

| Feature | Before | After |
|---------|--------|-------|
| Editor Type | Textarea | Rich Text (contentEditable) |
| Formatting | ❌ None | ✅ Bold, Italic, Underline |
| Alignment | ❌ No | ✅ Left, Center, Right |
| Lists | ❌ Manual | ✅ Bullet & Numbered |
| Links | ❌ Plain text | ✅ Clickable links |
| Emoji | ❌ No | ✅ Yes |
| Auto-save | ❌ No | ✅ Yes (localStorage) |
| Placeholder | ✅ Yes | ✅ Yes (custom) |
| Responsive | ✅ Basic | ✅ Fully responsive |

---

## 🎓 **User Guide untuk Siswa**

### **Tips Menggunakan Editor:**

1. **Format Teks:**
   - Blok teks dulu, baru klik format
   - Gunakan keyboard shortcuts untuk lebih cepat
   
2. **Membuat List:**
   - Klik tombol list sebelum menulis
   - Tekan Enter untuk item baru
   - Tekan Enter 2x untuk keluar dari list

3. **Insert Link:**
   - Blok teks yang akan dijadikan link
   - Klik tombol 🔗
   - Paste URL lengkap (dengan https://)

4. **Emoji:**
   - Klik emoji yang tersedia di toolbar
   - Atau copy-paste emoji dari luar

5. **Auto-Save:**
   - Jawaban otomatis tersimpan
   - Aman untuk refresh atau tutup tab
   - Draft hilang setelah submit

---

## 🐛 **Troubleshooting**

### **Editor tidak muncul?**
- Check browser console untuk error
- Pastikan JavaScript enabled
- Clear localStorage dan refresh

### **Format hilang setelah save?**
- Normal, format tersimpan sebagai HTML
- Format akan muncul kembali saat load

### **Emoji tidak muncul?**
- Pastikan browser support emoji
- Gunakan browser modern (Chrome, Firefox, Edge)

### **Auto-save tidak jalan?**
- Check localStorage tidak penuh
- Check browser privacy settings
- Incognito mode mungkin block localStorage

---

## 📈 **Future Enhancements**

### **Planned Features:**
- [ ] Insert image dari file
- [ ] Text color picker
- [ ] Highlight color
- [ ] Font size selector
- [ ] Undo/Redo buttons
- [ ] Code block formatting
- [ ] Table insertion
- [ ] Word count indicator
- [ ] Character limit warning
- [ ] Markdown support
- [ ] Export to PDF
- [ ] Spell checker
- [ ] Grammar suggestions

### **Backend Integration:**
- [ ] Real-time auto-save to server
- [ ] Collaborative editing
- [ ] Version history
- [ ] Draft recovery
- [ ] Cloud sync across devices

---

**Status:** ✅ **Production Ready**  
**Version:** 1.0.0  
**Last Updated:** December 26, 2025  
**Framework:** React with Vanilla CSS  
**Browser Support:** Chrome, Firefox, Safari, Edge (Latest 2 versions)
