// ==============================================================
// 1. GANTI LINK DI BAWAH DENGAN URL WEB APP APPS SCRIPT ANDA
// ==============================================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx2jrFeiEGcFgfrfrTblOqpcbeEGZDr7MElk1WxcNee/dev'; 

let currentUser = null;

// Eksekusi saat web dibuka
document.addEventListener("DOMContentLoaded", () => {
    // Cek apakah sudah pernah login (Sesi)
    if (localStorage.getItem('opi_session')) {
        currentUser = JSON.parse(localStorage.getItem('opi_session'));
        showDashboard();
    }
    
    // Fitur Enter untuk masuk
    document.getElementById('password').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') handleLogin();
    });
    document.getElementById('twofa-pin').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') verify2FA();
    });
});

// Fungsi Login Utama
async function handleLogin() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const btnLogin = document.getElementById('btn-login');

    // Validasi Kosong
    if (!user || !pass) {
        alert("Username dan Password tidak boleh kosong!");
        return;
    }

    // Peringatan jika URL Web App belum disalin
    if (SCRIPT_URL.includes('https://script.google.com/macros/s/AKfycbx2jrFeiEGcFgfrfrTblOqpcbeEGZDr7MElk1WxcNee/dev')) {
        alert("PENTING: Anda harus memasukkan link Google Apps Script ke dalam file script.js terlebih dahulu agar bisa terhubung ke Spreadsheet!");
        return;
    }

    // Ubah status tombol untuk mencegah spam klik
    btnLogin.innerText = "Memproses...";
    btnLogin.disabled = true;

    try {
        // MENGHINDARI CORS ERROR: Jangan gunakan header 'application/json' 
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'login', username: user, password: pass })
        });
        
        const result = await response.json();

        if (result.success) {
            currentUser = result.user;
            document.getElementById('login-section').classList.add('hidden');
            document.getElementById('twofa-section').classList.remove('hidden');
        } else {
            alert(result.message || "Username atau password salah!");
        }
    } catch (err) {
        alert("Kesalahan CORS atau Jaringan. Pastikan Web App di-deploy dengan akses 'Anyone' (Siapa Saja).");
        console.error(err);
    } finally {
        btnLogin.innerText = "Masuk";
        btnLogin.disabled = false;
    }
}

// Fungsi 2FA
function verify2FA() {
    const pin = document.getElementById('twofa-pin').value;
    if (pin === currentUser.two_fa_pin) {
        localStorage.setItem('opi_session', JSON.stringify(currentUser));
        showDashboard();
    } else {
        alert("PIN 2FA Salah!");
    }
}

// Buka Dashboard
function showDashboard() {
    document.getElementById('twofa-section').classList.add('hidden');
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('dashboard-section').classList.remove('hidden');
}

// Keluar / Logout
function logout() {
    localStorage.removeItem('opi_session');
    location.reload();
}