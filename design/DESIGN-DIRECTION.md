# Định hướng thiết kế: website dự án ABM Hòn Tre

Ngày lập: 27/10/2026. Prototype: [`prototype/index.html`](../prototype/index.html), mở trực tiếp bằng trình duyệt là chạy được.

## 1. Phân tích trang tham khảo

Phân tích bằng REA (`inspect-web-page`, chụp màn hình qua CDP) kết hợp puppeteer để cuộn trang, đo style đã tính toán (computed style) và đọc mã hiệu ứng.

### thedrylab.com: màu và cách sắp xếp nội dung

Dựng bằng Framer. Đã xem trang chủ, `/team`, `/data-analysis`, `/use-case`.

| Mục | Quan sát |
|---|---|
| Nền | Trắng `#FFFFFF` là chủ đạo. Panel dùng màu sea-salt `#F4F5ED` ở độ phủ 60%. Có những dải đen `#000` đặt xen kẽ. |
| Chữ | Đen, dùng thêm `rgba(4,3,1,.6)` và `.4` cho chữ phụ. Trên nền đen dùng trắng và trắng 60%. |
| Màu nhấn | Chỉ một màu xanh lá `#009D51` cho nút chính (Sign in, Start trial). Thanh thông báo trên cùng dùng xanh rất đậm `#03331C`. |
| Font | Neue Haas Grotesk Display, nét 500 cho hầu hết chữ. Tiêu đề 40 đến 64px, chữ mảnh, line-height chặt. |
| Bo góc | Nút dạng pill (100px). Card bo 8 đến 12px. |
| Bố cục trang chủ | Thanh thông báo, rồi nav (logo trái, link, nút đen và nút xanh). Tiếp theo: hero có headline căn giữa, một câu, hai nút, ảnh sản phẩm lớn có nút "Play video" ngay dưới. Sau đó lần lượt: dải logo đối tác, một câu tuyên bố lớn, panel tính năng (trái là chữ ngắn kèm danh sách dấu +, phải là ảnh sản phẩm trên nền ảnh macro thiên nhiên), dải đen trình bày use case, cặp câu ngắn đặt trên ảnh, FAQ dạng accordion, CTA trên ảnh thiên nhiên, rồi footer đen nhiều cột. |
| Trang con | Mỗi trang dùng chung nav, CTA và footer. Hero của trang con là ảnh toàn khổ có chữ đè lên (`/data-analysis`). `/team` có lưới 3 ảnh, khối "Our vision" hai cột và logo nhà đầu tư. Dải số liệu lớn kiểu "7.0mins, x3, 100%". |

Học được: một màu nhấn duy nhất, nền trắng và panel off-white đặt xen kẽ, đôi lúc ngắt nhịp bằng một dải tối. Sản phẩm được cho xem thật. Lượng chữ ít, tiêu đề mảnh và lớn.

### worldquant.com: hiệu ứng

Site WordPress, dùng GSAP 3.9.1 cùng ScrollTrigger và Draggable, không có Lenis.

- **Một timeline lớn bị ghim (pin) và tua theo cuộn (scrub):** `ScrollTrigger.create({ trigger: '.features-container', start: 'top top', end: '6000px', scrub: true, pin: true })`. Trong khoảng 6000px cuộn có nhiều "cảnh" nối tiếp nhau trên cùng một khung hình.
- **Video phóng to khi vào cảnh:** `.fs1-video` chuyển từ scale nhỏ lên `scale: 1`, `scrub: 1.2`.
- **Chữ "bậc thang" 3D:** các dòng "Change is…" lật theo `rotationY` có `stagger 0.05` và `skewY 2deg`, đặt trong `perspective: 800`.
- **Tiêu đề đa ngôn ngữ xuất hiện lần lượt:** chỉnh `opacity` từng cái một với stagger 0.03.
- **Ticker chạy ngang bằng CSS keyframes:** `nav-ticker 80s`, `tickerLeft/Right`.
- Typography rất lớn (120 đến 160px) với font GTEesti trên nền đen. Màu cam là gradient `#F72F18 → #FA8C24`.

### icmllab.vercel.app: style hiện đại

Dựng bằng Next.js và GSAP (`quickTo`, `ticker`, Observer).

- **Nền là lưới mảnh và các "blob" màu mờ:** `filter: blur(70px)`, `opacity .4`, radial-gradient indigo `#4B3DF0` và coral `#FF5B3D`. Khi chuột di chuyển, các blob trôi theo parallax qua `gsap.quickTo` với `data-depth` khác nhau.
- **Canvas pixel theo con trỏ:** một canvas 2D cố định, `mix-blend-mode: multiply`. Con trỏ để lại các ô vuông nhiều màu rồi mờ dần qua `gsap.ticker`. Hiệu ứng tự tắt khi người dùng bật `prefers-reduced-motion`.
- **Loader dạng lưới ô:** chỉ hiện một lần mỗi phiên nhờ `sessionStorage`.
- **Card nghiên cứu:** khi hover, một lưới pixel 9×6 hiện ra. **Accordion** mở rộng bằng cách chuyển `grid-template-rows`. Nhãn dùng font mono (Geist Mono). Có lớp noise SVG phủ nhẹ.
- Nav là các ô liền nhau, ô đang active đổi màu.

### greenx.vinuni.edu.vn: logo, thông điệp, không khí chuyển đổi xanh

- Màu thương hiệu: xanh dương `#134D8B` và đỏ `#C72127`, nền xám `#F4F4F4`, font Montserrat. Footer xanh dương có hình đường chân trời.
- Logo: bản ngang màu trắng (VinUniversity, Smart Green Transformation Center), lấy từ chính site. Site chỉ có bản trắng, nên trên trang của mình logo được đặt trên nền xanh GREEN-X.
- Thông điệp chính thức (bản tiếng Việt): "GREEN-X cam kết mang đến các giải pháp bền vững, tạo ra tác động thực sự và lâu dài ở quy mô lớn."
- **Liên quan trực tiếp:** trang [Đổi mới sáng tạo, Khánh Hòa](https://greenx.vinuni.edu.vn/innovation/khanh-hoa/) có Quy hoạch tăng trưởng xanh cho TP Nha Trang (2024 đến 2030), Bộ tiêu chuẩn du lịch xanh Khánh Hòa và khung M&E 61 chỉ số.

## 2. Định hướng cho trang của chúng ta

> **Cập nhật 27/10/2026 (sau góp ý của người dùng):**
> - Đề tài là nghiên cứu ABM tổng quát cho vận hành khách sạn và du lịch. Hòn Tre là địa điểm thử nghiệm đầu tiên.
> - Trang được sắp lại theo thứ tự: Hero (ABM cho khách sạn xanh hơn) → Vì sao cần mô hình → **Đóng góp** (4 đòn bẩy: điều hòa thông minh, buồng phòng, lộ trình, điều phối trò chơi, kèm đại lượng mô hình đo) → Một ngày (dữ liệu minh họa, có gắn nhãn) → Cho đơn vị vận hành và cho khoa học → Địa điểm thử nghiệm Hòn Tre (sơ đồ, demo, tab) → Câu hỏi nghiên cứu → Hợp tác.
> - Không còn số liệu của demo trong phần chữ, vì toàn bộ số đó là minh họa.
> - Đã gỡ hai hiệu ứng sao từ ICMLL (vệt pixel theo con trỏ, mảng màu trôi theo chuột). Hiệu ứng mới sẽ lấy từ React Bits.
> - Song ngữ, mặc định tiếng Anh.
>
> - **Chuyển sang React (Vite + TS)**. Hiệu ứng lấy từ React Bits:
>   - Topography: nền hero, đường đồng mức gợi địa hình đảo.
>   - SplitText: tiêu đề.
>   - SpotlightCard: các thẻ đòn bẩy.
>   - AnimatedContent: các thẻ hiện dần khi cuộn tới.
>   - DepthCarousel: slider ảnh.
> - Sơ đồ SVG của Hòn Tre được thay bằng mô hình 3D lấy từ demo (đã bỏ nhãn). Có thêm slider 4 ảnh Wikimedia Commons, ghi tác giả đầy đủ.
>
> Phần dưới đây là định hướng ban đầu, giữ lại để tham khảo.


**Ý tưởng:** cả trang là *một ngày mô phỏng trên Hòn Tre*. Khi người xem cuộn, đồng hồ chạy từ 06:00 đến 24:00, bầu trời đổi màu theo giờ, và đường phụ tải điện tự vẽ ra từ chính dữ liệu của mô hình (kịch bản cơ sở, seed 42, đỉnh 1.325 kW lúc 21:45). Đây là điểm người xem sẽ nhớ.

| Lấy từ | Áp dụng thế nào |
|---|---|
| Drylab | Nền sea-salt và trắng xen kẽ. Một màu xanh hành động duy nhất. Nút pill. Tiêu đề Be Vietnam Pro nét 500, mảnh và lớn. Hero gồm headline và ảnh sản phẩm lớn có nút Play. Panel tính năng: chữ bên trái, ảnh demo bên phải. Có một dải tối. |
| WorldQuant | Section "Một ngày" được ghim và tua theo cuộn bằng GSAP ScrollTrigger (`pin`, `scrub`). Trong đó đồng hồ, chương, số đo và biểu đồ đều chạy theo tiến độ cuộn. |
| ICMLL | Hero có lưới mảnh và blob mờ (xanh lá, xanh GREEN-X, coral) với parallax theo chuột. Con trỏ để lại các "tác tử" pixel (canvas, multiply). Accordion câu hỏi nghiên cứu mở bằng `grid-template-rows`. Số liệu dùng mono. |
| GREEN-X | Dải logo trên cùng. Band "Hợp tác" dùng màu xanh `#134D8B`, có logo trắng và trích thông điệp chính thức. Footer liên kết sang trang GREEN-X Khánh Hòa. |

**Bảng màu** (token trong `prototype/tokens.css`):

| Vai trò | Giá trị |
|---|---|
| Nền | sea-salt `oklch(97.4% .007 125)` và trắng ngả lạnh |
| Mực | xanh đen rừng `oklch(21% .022 165)` |
| Màu hành động | xanh chuyển đổi `oklch(51% .14 156)` |
| Màu đồng thương hiệu | GREEN-X `#134D8B` |
| Màu dữ liệu điện, phát thải | coral `oklch(62% .18 38)`, cùng tông với demo |

**Font:** Be Vietnam Pro, font được thiết kế cho dấu tiếng Việt. Riêng số liệu dùng JetBrains Mono.

**Các section:**
1. Dải GREEN-X
2. Nav
3. Hero có poster demo kiểu click-to-load (blur, nút Play, iframe chỉ được chèn khi bấm)
4. Một ngày (ghim và scrub)
5. Vì sao cần mô hình
6. Bên trong mô phỏng (tab, ảnh thật từ demo)
7. Hòn Tre, một hệ khép kín (sơ đồ kết nối)
8. Năm câu hỏi nghiên cứu (accordion)
9. Hợp tác (lộ trình 4 bước, cam kết dữ liệu, CTA)
10. Footer

**Khả năng truy cập và hiệu năng:**
- Khi bật `prefers-reduced-motion`: không ghim, biểu đồ hiển thị đầy đủ, danh sách chương hiện tĩnh.
- Khi không có JS: nội dung vẫn đọc được.
- Demo chỉ tải khi người xem bấm. Trên di động, nút Play mở demo sang tab mới.
- Đã qua kiểm tra Hallmark `sloplint --render`: các mục còn lại đều đã được miễn trừ có ghi lý do trong đầu file `styles.css`.

## 3. Việc cần người dùng xác nhận

- [x] **Cách diễn đạt quan hệ với GREEN-X.** Đã chốt: dự án thuộc GREEN-X, VinUni. Câu này xuất hiện ở dải trên cùng, band Hợp tác và footer.
- [x] **Email liên hệ hợp tác.** `greenx@vinuni.edu.vn`, gắn vào nút "Liên hệ hợp tác" (có sẵn tiêu đề thư) và footer.
- [ ] **Domain demo mới.** URL đang nằm trong `data-demo-src` và các link; khi có domain mới thì gom về một chỗ.
- [x] **Song ngữ.** Mặc định tiếng Anh, có bản tiếng Việt (`prototype/i18n.js`).
- [x] **Ảnh.** 4 ảnh Wikimedia Commons trong slider (credit ở chú thích và footer). Còn có thể bổ sung ảnh đội ngũ nếu có.
