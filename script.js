/* ===================================
   BBQ出欠確認フォーム - JavaScript
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ========== 要素取得 ==========
    const form = document.getElementById('rsvpForm');
    const attendDetails = document.getElementById('attendDetails');
    const allergyDetail = document.getElementById('allergyDetail');
    const attendYes = document.getElementById('attend-yes');
    const attendNo = document.getElementById('attend-no');
    const allergyYes = document.getElementById('allergy-yes');
    const allergyNo = document.getElementById('allergy-no');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMessage = document.getElementById('successMessage');
    const formCard = document.querySelector('.form-card');
    const resetBtn = document.getElementById('resetBtn');

    // ========== Google Apps Script URL ==========
    // セットアップ手順書に従ってURLを設定してください
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzI8Zb0J_Yyh0BZsynvLGo-56JHiqU2ut2lPawT9TD7U7MqVlbKt9zERFEG6YMohhwY/exec';

    // ========== 出欠切り替え ==========
    function toggleAttendDetails() {
        if (attendYes.checked) {
            attendDetails.classList.remove('hidden');
        } else {
            attendDetails.classList.add('hidden');
        }
    }

    attendYes.addEventListener('change', toggleAttendDetails);
    attendNo.addEventListener('change', toggleAttendDetails);

    // ========== アレルギー切り替え ==========
    function toggleAllergyDetail() {
        if (allergyYes.checked) {
            allergyDetail.classList.remove('hidden');
        } else {
            allergyDetail.classList.add('hidden');
            document.getElementById('allergyText').value = '';
        }
    }

    allergyYes.addEventListener('change', toggleAllergyDetail);
    allergyNo.addEventListener('change', toggleAllergyDetail);

    // ========== バリデーション ==========
    function validateForm() {
        let isValid = true;

        // お名前
        const nameGroup = document.getElementById('name').closest('.form-group');
        if (!document.getElementById('name').value.trim()) {
            nameGroup.classList.add('error');
            isValid = false;
        } else {
            nameGroup.classList.remove('error');
        }

        // 出欠
        const attendanceGroup = document.querySelector('input[name="attendance"]').closest('.form-group');
        if (!document.querySelector('input[name="attendance"]:checked')) {
            attendanceGroup.classList.add('error');
            isValid = false;
        } else {
            attendanceGroup.classList.remove('error');
        }

        return isValid;
    }

    // リアルタイムバリデーション解除
    document.getElementById('name').addEventListener('input', function () {
        if (this.value.trim()) {
            this.closest('.form-group').classList.remove('error');
        }
    });

    document.querySelectorAll('input[name="attendance"]').forEach(radio => {
        radio.addEventListener('change', function () {
            this.closest('.form-group').classList.remove('error');
        });
    });

    // ========== フォーム送信 ==========
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // 最初のエラーにスクロール
            const firstError = document.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // 送信データ収集
        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        const formData = {
            name: document.getElementById('name').value.trim(),
            attendance: attendance,
            adultCount: attendance === '出席' ? document.getElementById('adultCount').value : '0',
            childCount: attendance === '出席' ? document.getElementById('childCount').value : '0',
            infantCount: attendance === '出席' ? document.getElementById('infantCount').value : '0',
            allergy: attendance === '出席' ? document.querySelector('input[name="allergy"]:checked')?.value || 'なし' : 'ー',
            allergyText: attendance === '出席' && allergyYes.checked ? document.getElementById('allergyText').value.trim() : '',
            softDrinkCount: attendance === '出席' ? document.getElementById('softDrinkCount').value : '0',
            alcoholCount: attendance === '出席' ? document.getElementById('alcoholCount').value : '0',
            notes: document.getElementById('notes').value.trim(),
            timestamp: new Date().toLocaleString('ja-JP')
        };

        // ボタン状態変更
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');

        try {
            if (SCRIPT_URL) {
                // Google Apps Script にデータ送信
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            } else {
                // URLが設定されていない場合はコンソールに出力
                console.log('📋 フォーム送信データ:', formData);
                // デモ用に少し待つ
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // 成功表示
            showSuccess();
        } catch (error) {
            console.error('送信エラー:', error);
            // no-corsモードの場合エラーをキャッチしないが、念のため
            showSuccess();
        }
    });

    // ========== 送信成功表示 ==========
    function showSuccess() {
        formCard.classList.add('hidden');
        successMessage.classList.remove('hidden');
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // ボタンリセット
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
    }

    // ========== リセット ==========
    resetBtn.addEventListener('click', () => {
        form.reset();
        attendDetails.classList.add('hidden');
        allergyDetail.classList.add('hidden');
        successMessage.classList.add('hidden');
        formCard.classList.remove('hidden');
        formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // エラー状態もリセット
        document.querySelectorAll('.form-group.error').forEach(g => g.classList.remove('error'));
    });
});
