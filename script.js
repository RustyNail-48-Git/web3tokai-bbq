/* ===================================
   BBQ参加申込みフォーム - JavaScript
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ========== 要素取得 ==========
    const form = document.getElementById('rsvpForm');
    const allergyDetail = document.getElementById('allergyDetail');
    const allergyYes = document.getElementById('allergy-yes');
    const allergyNo = document.getElementById('allergy-no');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMessage = document.getElementById('successMessage');
    const formCard = document.querySelector('.form-card');
    const resetBtn = document.getElementById('resetBtn');
    const helpNone = document.getElementById('help-none');
    const catStudent = document.getElementById('cat-student');
    const catInfant = document.getElementById('cat-infant');
    const childrenDetail = document.getElementById('childrenDetail');
    const studentCountWrap = document.getElementById('studentCountWrap');
    const infantCountWrap = document.getElementById('infantCountWrap');

    // ========== Google Apps Script URL ==========
    // セットアップ手順書に従ってURLを設定してください
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzI8Zb0J_Yyh0BZsynvLGo-56JHiqU2ut2lPawT9TD7U7MqVlbKt9zERFEG6YMohhwY/exec';

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

    // ========== 参加区分チェックボックス切り替え ==========
    function toggleChildrenDetail() {
        const isStudent = catStudent.checked;
        const isInfant = catInfant.checked;

        if (isStudent || isInfant) {
            childrenDetail.classList.remove('hidden');
        } else {
            childrenDetail.classList.add('hidden');
        }

        studentCountWrap.style.display = isStudent ? '' : 'none';
        infantCountWrap.style.display = isInfant ? '' : 'none';

        if (!isStudent) document.getElementById('studentCount').value = '0';
        if (!isInfant) document.getElementById('infantCount').value = '0';
    }

    document.querySelectorAll('input[name="category"]').forEach(cb => {
        cb.addEventListener('change', toggleChildrenDetail);
    });

    // ========== 「当日は参加のみ」排他処理 ==========
    helpNone.addEventListener('change', function () {
        if (this.checked) {
            document.querySelectorAll('input[name="help"]').forEach(cb => {
                if (cb !== helpNone) cb.checked = false;
            });
        }
    });

    document.querySelectorAll('input[name="help"]').forEach(cb => {
        if (cb !== helpNone) {
            cb.addEventListener('change', function () {
                if (this.checked) helpNone.checked = false;
            });
        }
    });

    // ========== バリデーション ==========
    function validateForm() {
        let isValid = true;

        // 同意事項
        const agree1 = document.getElementById('agree1');
        const agree2 = document.getElementById('agree2');
        const agree3 = document.getElementById('agree3');
        const agreementGroup = agree1.closest('.form-group');
        if (!agree1.checked || !agree2.checked || !agree3.checked) {
            agreementGroup.classList.add('error');
            isValid = false;
        } else {
            agreementGroup.classList.remove('error');
        }

        // お名前
        const nameGroup = document.getElementById('name').closest('.form-group');
        if (!document.getElementById('name').value.trim()) {
            nameGroup.classList.add('error');
            isValid = false;
        } else {
            nameGroup.classList.remove('error');
        }

        // メールアドレス
        const emailInput = document.getElementById('email');
        const emailGroup = emailInput.closest('.form-group');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
            emailGroup.classList.add('error');
            isValid = false;
        } else {
            emailGroup.classList.remove('error');
        }

        // 参加区分（チェックボックス）
        const categoryGroup = document.querySelector('input[name="category"]').closest('.form-group');
        const categoryChecked = document.querySelectorAll('input[name="category"]:checked');
        if (categoryChecked.length === 0) {
            categoryGroup.classList.add('error');
            isValid = false;
        } else {
            categoryGroup.classList.remove('error');
        }

        // 交通手段
        const transportGroup = document.querySelector('input[name="transport"]').closest('.form-group');
        if (!document.querySelector('input[name="transport"]:checked')) {
            transportGroup.classList.add('error');
            isValid = false;
        } else {
            transportGroup.classList.remove('error');
        }

        // 桑名駅ピックアップ
        const pickupGroup = document.querySelector('input[name="pickup"]').closest('.form-group');
        if (!document.querySelector('input[name="pickup"]:checked')) {
            pickupGroup.classList.add('error');
            isValid = false;
        } else {
            pickupGroup.classList.remove('error');
        }

        // アレルギー
        const allergyGroup = document.querySelector('input[name="allergy"]').closest('.form-group');
        if (!document.querySelector('input[name="allergy"]:checked')) {
            allergyGroup.classList.add('error');
            isValid = false;
        } else {
            allergyGroup.classList.remove('error');
        }

        return isValid;
    }

    // リアルタイムバリデーション解除
    document.getElementById('name').addEventListener('input', function () {
        if (this.value.trim()) {
            this.closest('.form-group').classList.remove('error');
        }
    });

    document.getElementById('email').addEventListener('input', function () {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailPattern.test(this.value.trim())) {
            this.closest('.form-group').classList.remove('error');
        }
    });

    // 同意チェックボックスのリアルタイムバリデーション解除
    document.querySelectorAll('.agreement-item input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', function () {
            const agree1 = document.getElementById('agree1');
            const agree2 = document.getElementById('agree2');
            const agree3 = document.getElementById('agree3');
            if (agree1.checked && agree2.checked && agree3.checked) {
                this.closest('.form-group').classList.remove('error');
            }
        });
    });

    // ラジオボタンのリアルタイムバリデーション解除
    ['transport', 'pickup', 'allergy'].forEach(name => {
        document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
            radio.addEventListener('change', function () {
                this.closest('.form-group').classList.remove('error');
            });
        });
    });

    // 参加区分チェックボックスのリアルタイムバリデーション解除
    document.querySelectorAll('input[name="category"]').forEach(cb => {
        cb.addEventListener('change', function () {
            const checked = document.querySelectorAll('input[name="category"]:checked');
            if (checked.length > 0) {
                this.closest('.form-group').classList.remove('error');
            }
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

        // 手伝い可能内容を収集
        const helpValues = [];
        document.querySelectorAll('input[name="help"]:checked').forEach(cb => {
            helpValues.push(cb.value);
        });

        // 参加区分を収集
        const categoryValues = [];
        document.querySelectorAll('input[name="category"]:checked').forEach(cb => {
            categoryValues.push(cb.value);
        });

        // 送信データ収集
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            category: categoryValues.join('、'),
            studentCount: catStudent.checked ? document.getElementById('studentCount').value : '0',
            infantCount: catInfant.checked ? document.getElementById('infantCount').value : '0',
            transport: document.querySelector('input[name="transport"]:checked').value,
            pickup: document.querySelector('input[name="pickup"]:checked').value,
            allergy: document.querySelector('input[name="allergy"]:checked').value,
            allergyText: allergyYes.checked ? document.getElementById('allergyText').value.trim() : '',
            area: document.getElementById('area').value.trim(),
            drinking: document.querySelector('input[name="drinking"]:checked')?.value || '未回答',
            help: helpValues.join('、') || '未回答',
            comments: document.getElementById('comments').value.trim(),
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
        allergyDetail.classList.add('hidden');
        childrenDetail.classList.add('hidden');
        studentCountWrap.style.display = 'none';
        infantCountWrap.style.display = 'none';
        successMessage.classList.add('hidden');
        formCard.classList.remove('hidden');
        formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // エラー状態もリセット
        document.querySelectorAll('.form-group.error').forEach(g => g.classList.remove('error'));
    });
});
