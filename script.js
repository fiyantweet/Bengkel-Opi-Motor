// =================================================================================
// 1. MASUKKAN URL APLIKASI WEB GOOGLE APPS SCRIPT ANDA DI BAWAH INI:
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx2jrFeiEGcFgfrfrTblOqpcbeEGZDr7MElk1WxcNee/dev";
// =================================================================================

let currentUser = null;

// Fungsi Utama untuk menembak ke Google Sheets
async function apiCall(data) {
    if (SCRIPT_URL === "https://script.google.com/macros/s/AKfycbx2jrFeiEGcFgfrfrTblOqpcbeEGZDr7MElk1WxcNee/dev") {
        return { success: false, message: "ERROR: SCRIPT_URL di script.js belum diisi!" };
    }
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        return { success: false, message: "Koneksi ke server gagal. Pastikan SCRIPT_URL benar dan Anda terhubung internet." };
    }
}

// Fungsi Eksekusi Login
async function handleLogin() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const btnLogin = document.getElementById('btn-login');

    if (!user || !pass) {
        alert("Username dan Password tidak boleh kosong!");
        return;
    }

    // Ubah tombol jadi status loading agar tak dipencet dua kali
    btnLogin.innerText = "Memproses Database...";
    btnLogin.disabled = true;

    // Memanggil Backend Google Apps Script
    const res = await apiCall({ action: 'login', username: user, password: pass });

    // Kembalikan status tombol
    btnLogin.innerText = "Masuk";
    btnLogin.disabled = false;

    if (res.success) {
        currentUser = res.user;
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('twofa-section').classList.remove('hidden');
    } else {
        alert(res.message);
    }
}

// Verifikasi 2FA
function verify2FA() {
    const pin = document.getElementById('twofa-pin').value;
    if (pin === currentUser.two_fa_pin) {
        document.getElementById('twofa-section').classList.add('hidden');
        document.getElementById('dashboard-section').classList.remove('hidden');
    } else {
        alert("PIN 2FA Salah!");
    }
}

// Batal Login
function cancelLogin() {
    currentUser = null;
    document.getElementById('twofa-section').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('twofa-pin').value = '';
}

// Keluar / Logout
function logout() {
    location.reload();
}

// Tambahkan kemampuan tekan 'Enter' di keyboard untuk masuk
document.getElementById('password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') handleLogin();
});

document.getElementById('twofa-pin').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') verify2FA();
});