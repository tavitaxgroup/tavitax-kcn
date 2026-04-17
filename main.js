document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.06)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 1)';
            header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
        }
    });

    // 2. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // 3. CRM Form Submission Mock (Module 2, 3, 5 - Automation via Make/Zapier)
    const CRMForm = document.getElementById('crm-lead-form');
    if (CRMForm) {
        CRMForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather data (This would typically go to Zapier/Make Webhook)
            const payload = {
                name: document.getElementById('lead-name').value,
                phone: document.getElementById('lead-phone').value,
                email: document.getElementById('lead-email').value,
                need: document.getElementById('lead-need').value,
                source: 'Landing Page KCN'
            };

            // Send Data to Make.com Webhook
            console.log("SENDING DATA TO MAKE WEBHOOK:", payload);
            
            const btn = CRMForm.querySelector('.btn-primary');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Đang gửi...';
            btn.style.pointerEvents = 'none';

            fetch("https://hook.eu1.make.com/0ym1y5m2gbfrmfoi1z5m2tcbrxellh70", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                btn.innerHTML = '<i class="ph ph-check-circle"></i> Yêu cầu thành công!';
                btn.style.background = '#22c55e'; // Green
                
                setTimeout(() => {
                    alert(`Cảm ơn ${payload.name}! Đại diện Tavitax sẽ gọi lại bạn trong 5 phút. File PDF "Bảng Giá Đất KCN 2026" cũng vừa được gửi qua hệ thống Automation.`);
                    CRMForm.reset();
                    btn.innerHTML = originalText;
                    btn.style.background = ''; // reset
                    btn.style.pointerEvents = 'auto';
                }, 1000);
            })
            .catch(error => {
                console.error("Error:", error);
                btn.innerHTML = '<i class="ph ph-x-circle"></i> Lỗi hệ thống';
                btn.style.background = '#ef4444'; // Red
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = ''; // reset
                    btn.style.pointerEvents = 'auto';
                }, 2000);
            });
        });
    }

    // 4. KCN Advanced Filter Mock (Module 1 - Filter)
    const btnSearch = document.querySelector('.btn-search');
    const filterRegion = document.getElementById('filter-region');
    const filterArea = document.getElementById('filter-area');
    const filterPrice = document.getElementById('filter-price');
    const kcnCards = document.querySelectorAll('.kcn-card');

    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            const region = filterRegion.value;
            const area = filterArea.value;
            const price = filterPrice.value;

            // Simple basic filter logic (for demo)
            // In a real startup (Module 6), this runs via SQL on Supabase/PostgreSQL
            kcnCards.forEach(card => {
                const cardRegion = card.getAttribute('data-region');
                
                let isMatch = true;
                if (region !== 'all' && cardRegion !== region) isMatch = false;
                
                // Currently Area and Price matching logic are skipped in UI view, 
                // just demonstrating the concept.
                
                if (isMatch) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Provide feedback
            btnSearch.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Đang Lọc...';
            setTimeout(() => {
                btnSearch.innerHTML = '<i class="ph ph-check"></i> Đã Áp Dụng Lọc';
                setTimeout(()=> btnSearch.innerHTML = '<i class="ph ph-magnifying-glass"></i> Lọc Dự Án', 2000);
            }, 600);
        });
    }
});
