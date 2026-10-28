# CLAUDE.md — ABM Hotel project website

## Website này là gì

Trang chủ giới thiệu (project page) cho dự án nghiên cứu **Virtual Hotel Monitoring (ABM)**, thuộc GREEN-X, VinUni.

**Cách hiểu đúng về đề tài (người dùng đã sửa, 27/10/2026):**
- Đây là **nghiên cứu ABM tổng quát cho vận hành khách sạn/du lịch** (khung mô hình, hiệu chỉnh, kiểm định, chuyển sang cơ sở khác). **Hòn Tre chỉ là địa điểm thử nghiệm, nơi áp dụng đầu tiên**, không phải nền để dựng đề tài. Đừng viết như thể dự án "về Hòn Tre".
- Trọng tâm trang là **đóng góp thực tế**: điều hòa bật/tắt thông minh theo hiện diện, tiết kiệm điện năng và đỉnh tải, giảm phát thải (hỗ trợ báo cáo Scope 2), phối hợp buồng phòng, gợi ý lộ trình, điều phối trò chơi; và đóng góp khoa học. Demo chỉ là minh chứng, không phải trọng tâm.

- Người đọc chính: đối tác vận hành tiềm năng (Vinpearl / VinWonders), giảng viên và nhà nghiên cứu, hội đồng duyệt, người quan tâm tới du lịch bền vững.
- Giọng văn: khoa học nhưng dễ hiểu. Không quảng cáo quá đà, không gọi là "digital twin" khi chưa có vòng phản hồi.
- Stack (chốt 27/10/2026): **Vite + React 19 + TypeScript** ở thư mục gốc (`src/`, `public/`). `prototype/` là bản HTML tĩnh cũ, chỉ để tham khảo, không sửa tiếp.

## Nguyên tắc chọn lọc nội dung

Tài liệu gốc (`Mo_ta_san_pham_ABM_v2_Huong_nghien_cuu.pdf`, lập 24/10/2026) chỉ là nguồn context. **Không đưa toàn bộ lên web.** Chọn lọc, viết lại ngắn gọn.

Nên đưa lên:
- Tóm tắt một câu + mô tả ngắn về ABM (khách là agent → vận hành → điện → phát thải, có theo dõi chất lượng dịch vụ).
- Đóng góp thực tế (đòn bẩy vận hành và những gì mô hình đo) và đóng góp khoa học.
- Hòn Tre như **địa điểm thử nghiệm đầu tiên** (xem mục dưới), kèm ý chuyển sang khách sạn khác (RQ5).
- Vấn đề (dữ liệu phân mảnh, chính sách xanh khó đánh giá trước, thử nghiệm trực tiếp rủi ro) và giá trị (thử kịch bản trong môi trường ảo trước khi áp dụng thật: đánh giá chi phí, rủi ro, tiết kiệm thời gian).
- Tính năng hiện có: bản đồ 3D phát lại một ngày, dashboard, so sánh chính sách, tái lập bằng seed. (Không giới thiệu chuyện demo có nhiều ngôn ngữ — người dùng yêu cầu bỏ.)
- Hướng phát triển ở mức chung chung, không đưa lộ trình 5 mức hay kế hoạch pha. Khung kể chuyện: **Ý tưởng & nguyên mẫu → Kêu gọi hợp tác (call for collaboration) → Xây dựng hệ thống với dữ liệu thật → Hỗ trợ vận hành xanh.** Trang nên có lời mời hợp tác rõ ràng (CTA liên hệ).
- Câu hỏi nghiên cứu ở dạng rút gọn (RQ1–RQ5, mỗi câu một dòng).
- (Đã bỏ theo yêu cầu 28/10) Danh sách cam kết quyền riêng tư không hiển thị trên trang.
- Demo nhúng trực tiếp bằng iframe + link mở tab mới.
- Hòn Tre minh họa bằng **mô hình 3D** (lấy từ demo, không nhãn) + **slider ảnh thật** có credit.

Không đưa (hoặc chỉ ở mức rất khái quát):
- Bảng dữ liệu cần có chi tiết (mục 5), danh sách nguồn dữ liệu nội bộ (PMS, BMS, log thẻ từ…).
- Rủi ro nghiên cứu và cách giảm (mục 4.8).
- Chỉ số kiểm định chi tiết (RMSE/MAPE, KS-statistic, log-likelihood) — chỉ nói "kiểm định trên dữ liệu giữ lại".
- Các comment/nhận xét nội bộ của người duyệt trong PDF.
- Thông số giả định chi tiết (26 nhân viên buồng phòng, 300 khách ngày…) trừ khi minh họa có chủ đích.
- Lộ trình 5 mức (synthetic → hiệu chỉnh → kiểm định → shadow → twin) và kế hoạch pha 0–4.
- Câu "không phải sản phẩm chính thức của Vinpearl" — người dùng yêu cầu bỏ.
- **Số liệu của web demo**: toàn bộ là giả định, mang tính minh họa. Không dùng làm kết quả/đóng góp (không ghi "tiết kiệm X%"). Nếu buộc phải dùng (vd. biểu đồ một ngày) thì phải gắn nhãn rõ "dữ liệu minh họa từ nguyên mẫu, không phải số đo".
- Logo/thương hiệu Vinpearl, VinWonders: không dùng (chỉ nhắc tên địa điểm).

## Demo

- URL: `https://abm.icclab.site` — **domain sẽ đổi**, giữ URL ở một chỗ cấu hình duy nhất.
- Nhúng được bằng iframe (kiểm tra 27/10/2026: GitHub Pages, không có `X-Frame-Options`/CSP `frame-ancestors`, không có code chống nhúng). Kiểm tra lại khi đổi domain.
- Demo là trang nặng (~1.1 MB HTML, bản đồ 3D) → **click-to-load**: ban đầu chỉ hiện ảnh poster (screenshot bản đồ 3D) phủ blur + nút Play ở giữa; chỉ khi user bấm mới chèn `<iframe>` vào DOM (không dùng `loading="lazy"` vì vẫn tự tải khi cuộn tới). Khi iframe đang tải: giữ poster + spinner, bỏ blur khi `onload`. Có nút "Mở toàn màn hình" sang tab mới. Poster cần là ảnh tối ưu (WebP/AVIF, vài chục KB). Trên mobile cân nhắc nút Play mở tab mới thay vì nhúng.

## Dự án: Virtual Hotel Monitoring (ABM)

Tên đầy đủ (tiếng Anh): *Agent-Based Modeling for Tourism Hotel Management and Optimal Carbon Footprint Trajectories*.

Nguyên mẫu nghiên cứu (VinUni tham gia thu dữ liệu theo đề xuất) mô phỏng một ngày vận hành của khu nghỉ dưỡng tích hợp khách sạn + công viên giải trí. Mỗi nhóm khách là một agent có sở thích, ngân sách, mức đói, mệt, cảm giác nóng, khả năng chịu xếp hàng; giữ nguyên đặc tính suốt hành trình (phòng → bữa sáng → đi bộ → công viên → nhà hàng → khu nghỉ → về phòng). Từ hành vi, mô hình tính điện năng, phát thải từ điện, ùn tắc và chất lượng dịch vụ.

Phạm vi mô phỏng mặc định:
- Khách sạn trên đảo và trên bờ (số phòng cố định, công suất điều chỉnh được); 300 khách ngày từ thành phố.
- Kết nối: cáp treo (2 cabin × 8 người/phút, 09:00–22:00), tàu cao tốc (20 người, 20 phút/chuyến), xe nội khu bờ (25 người, 10 phút/chuyến), đi bộ 14 phút từ sảnh khách sạn đảo tới cổng công viên.
- Công viên: trò cảm giác mạnh, trò gia đình, khu trong nhà, khu nước, sân khấu theo lịch, nhà hàng, khu nghỉ.
- Vận hành khách sạn: điều hòa phòng, buồng phòng theo ca, giặt là theo mẻ.

Tính năng hiện có:
- **Bản đồ 3D** (trang chủ của app demo): phát lại một ngày — khách đi lại, hàng chờ, cáp treo, tàu, xe; bấm khách sạn xem mặt cắt từng tầng, từng phòng.
- **Dashboard**: lưới phòng; nhóm khách và lý do quyết định; điện/phát thải theo mục đích; hàng chờ, cáp treo, tàu, buồng phòng, giặt là; so sánh ghép cặp 10 seed giữa chính sách; xuất CSV.
- **Tái lập**: seed cố định; 24 test tự động + 19 kiểm tra mô hình (bảo toàn số khách, sức chứa, điện = công suất × thời gian…). Giao diện VI / EN / RU.

Câu hỏi nghiên cứu tổng quát: hành vi không đồng nhất của khách và chính sách vận hành phối hợp ảnh hưởng thế nào tới phát thải từ điện và chất lượng dịch vụ trong hệ khách sạn – công viên?
- RQ1 Hành vi lựa chọn (thí nghiệm lựa chọn, mixed logit, ≥400 phiếu).
- RQ2 Dự báo dòng khách: ABM so với chuỗi Markov.
- RQ3 Năng lượng và tiện nghi: điều hòa theo hiện diện, phối hợp buồng phòng, gợi ý lộ trình, điều phối trò chơi — đánh đổi ở đâu.
- RQ4 Digital shadow/twin với dữ liệu chi phí thấp.
- RQ5 Khả năng áp dụng sang cơ sở khác.

Lộ trình nội bộ (chỉ để hiểu, **không đưa lên web**): Mức 1 ABM synthetic (hiện tại) → 2 hiệu chỉnh bằng dữ liệu thật → 3 kiểm định → 4 digital shadow → 5 digital twin. Kế hoạch pha 0–4: nguyên mẫu (xong) → NDA, đạo đức, thử nghiệm nhỏ → thu thập → hiệu chỉnh/kiểm định, bài báo → shadow/twin.

Thu thập dữ liệu đề xuất: app bản đồ cho khách (tìm đường, xem thời gian chờ; đổi lại ghi quỹ đạo GPS khi opt-in), cảm biến hồng ngoại đếm người (không camera), khảo sát 5–7 phút.

Đầu ra dự kiến: bài báo khoa học; bộ dữ liệu ẩn danh đã gộp (nếu được phép); mã nguồn và dashboard công khai. Ứng dụng: hỗ trợ báo cáo phát thải Scope 2, chọn chính sách theo mục tiêu điện năng và tiện nghi.

Hướng đang được thảo luận (từ nhận xét của người duyệt — chưa chốt, chỉ nhắc khi được yêu cầu):
- "Cognitive twin" (gợi ý của prof. Dung) thay cho/bên cạnh digital twin.
- Lý thuyết trò chơi, lý thuyết mạng hành vi từ dữ liệu thật.
- Cần khung kiểm chứng ABM vững hơn; benchmark với AnyLogic (i7-AnyEnergy), NetLogo (Coastal Tourism Vulnerabilities Model), dTS Framework.
- Tận dụng đặc điểm địa lý/khí hậu Nha Trang cho tối ưu nhiệt và năng lượng.

## Địa điểm thử nghiệm đầu tiên: đảo Hòn Tre, Nha Trang

Hòn Tre là **nơi áp dụng và thử nghiệm đầu tiên** của khung nghiên cứu: **đảo Hòn Tre, vịnh Nha Trang (Khánh Hòa)** — nơi có quần thể Vinpearl và công viên **VinWonders Nha Trang**. Đây là bối cảnh lý tưởng vì hệ thống khép kín: đảo không có đường bộ, khách vào bằng cáp treo hoặc tàu cao tốc, nên dòng khách, hàng chờ và điện năng đo được trong một ranh giới rõ.

Thông tin tham khảo (từ nguồn du lịch, **cần kiểm chứng trước khi đưa số liệu lên web**):
- Cáp treo vượt biển Vinpearl từ đường Trần Phú ra Hòn Tre, do POMA (Pháp) xây; từng giữ kỷ lục Guinness cáp treo vượt biển dài nhất (~3.320 m, mở 2007). Sau khi dời ga đất liền, nguồn gần đây ghi ~2.643 m. Đi mất ~8–12 phút.
- Tàu cao tốc ra đảo ~7–10 phút.
- VinWonders Nha Trang (đổi tên từ Vinpearl Land năm 2020): trò chơi, công viên nước, thủy cung, show biểu diễn; nhiều nguồn ghi ~200.000 m² (có nguồn ghi >50 ha — số đo khác nhau).
- Resort trên đảo gồm Vinpearl Resort & Spa Nha Trang Bay, Vinpearl Resort Nha Trang… (danh sách đầy đủ cần xác nhận trên vinpearl.com). Hòn Tằm là đảo khác, không thuộc phạm vi.
- Khí hậu: nhiệt đới savan, ôn hòa hơn vùng xung quanh, nhiệt độ trung bình năm ~26 °C; mùa mưa khoảng tháng 9–12 (tháng 10 mưa nhiều nhất); nắng nóng nhất khoảng tháng 6–8. Liên quan trực tiếp tới tải điều hòa trong mô hình.

Lưu ý: tham số trong mô phỏng (giờ cáp treo 09:00–22:00, công suất cabin…) là giả định của mô hình, có thể khác thực tế vận hành — không trình bày như số liệu chính thức.

## Cấu trúc code

- `src/i18n/dict.ts`: toàn bộ chữ EN/VI (cùng bộ key, EN mặc định). `src/i18n/I18nProvider.tsx`: `useI18n()` → `t`, `list`, `nf`, `lang`, `setLang` (đọc `?lang=`, lưu localStorage, cập nhật `<html lang>`, title, meta).
- `src/config.ts`: URL demo (một chỗ duy nhất, domain sẽ đổi), email, link GREEN-X, danh sách ảnh + credit, màu hex cho WebGL (mirror của `src/styles/tokens.css`).
- `src/sections/*`: từng section của trang. `src/components/IslandModel.tsx`: mô hình 3D (react-three-fiber, lazy-load khi gần viewport, chỉ render liên tục khi đang hiển thị).
- `src/components/reactbits/*`: component lấy nguyên từ React Bits (TS + CSS): SplitText (tiêu đề hero), ScrollStack (thẻ đòn bẩy), ScrollReveal (câu lợi ích), ScrollVelocity (marquee, cần gói `motion`), và nền động màu xanh cho các phần nền sáng: DotGrid (Cách tiếp cận), Threads (Câu hỏi nghiên cứu), Waves (Đòn bẩy, cố định theo màn hình, cắt theo section), DotField (Cho đơn vị vận hành / khoa học), LineWaves (Demo). Nền bọc trong `src/components/LazyBackground.tsx` (chỉ mount khi gần viewport, bỏ khi giảm chuyển động); màu lấy từ `HEX.accent/leaf/mist`, độ đậm chỉnh bằng `opacity` của `.section-bg` trong `scenes.css`. Giữ `LICENSE.md` (MIT + Commons Clause) đi kèm.
- `public/models/hontre.glb`: mô hình Hòn Tre xuất từ scene three.js của demo, **giữ đủ chi tiết** (texture mặt tiền, nền, thành nước, dây cáp, ánh sáng, bóng đổ); chỉ bỏ nội dung động (khách/tác tử, vòng trạng thái khu). `userData` của node `HonTrePilot` chứa đèn, đường cáp (điểm mẫu), shader mặt nước; node `gondola` là mẫu cabin — `IslandModel.tsx` cho 24 cabin chạy dọc 2 dây cáp. Màu trong demo đã là linear (ColorManagement bật) — không chuyển đổi lại khi xuất. Đèn r147 → r170 nhân π. (~1,7 MB, meshopt + instancing + webp)
- Ảnh chụp demo có bản theo ngôn ngữ: `public/assets/demo-<map|energy|compare|rooms>-<en|vi>.webp` (chụp bằng `?lang=en|vi`); link sang demo luôn kèm `?lang=` theo ngôn ngữ trang (`demoHome`, `demoPage`, `demoShot` trong `config.ts`).
- `public/assets/photos/*`: ảnh Wikimedia Commons đã nén WebP; credit bắt buộc (nhãn trên ảnh + trang `#credits`).
- Lệnh: `npm run dev`, `npm run build`, `npm run preview`.

## Thiết kế

- **Redesign Hallmark (28/10/2026), mỗi nhịp kể là một màn hình:**
  1. Hero (ảnh cáp treo toàn khổ)
  2. Một ngày (mốc 3 giờ)
  3. Vì sao (3 câu thay nhau)
  4. Cách tiếp cận (chuỗi tác tử → điện → phát thải)
  4b. Năm câu hỏi nghiên cứu (mỗi câu một nhịp) — đặt sớm, ngay sau Cách tiếp cận
  5. Marquee
  6. Đòn bẩy (ScrollStack)
  7. Lợi ích (ScrollReveal trên ảnh)
  8. Hòn Tre: 3D toàn màn hình (thẻ chữ cột trái, đảo bên phải), rồi demo click-to-load (không còn dải ảnh, không còn tab ảnh màn hình)
  10. Hợp tác (nền ảnh thành phố và vịnh Nha Trang của Leonid; ảnh vệ tinh đã bỏ vì độ phân giải thấp)
- Header (`SiteHeader`) cố định, không chiếm chỗ trong bố cục: dải GREEN-X trên cùng (thu lên khi cuộn) + thanh nav nổi nền kính đục. Mọi cảnh bắt đầu từ mép trên cửa sổ; nội dung trong cảnh phải chừa khoảng cho thanh nav (~110px).
- Cảnh ghim/tua theo cuộn dùng `src/hooks/useScene.ts` (GSAP ScrollTrigger, chỉ chạy trên màn rộng khi không bật giảm chuyển động; mặc định CSS là bố cục tĩnh xếp chồng). `App.tsx` gọi `ScrollTrigger.sort()/refresh()` sau khi mount — mọi pin phải tạo trong layout effect.
- Ảnh: registry `PHOTO` trong `config.ts` (tác giả, giấy phép, link Commons). Mỗi ảnh có nhãn credit nhỏ ở góc (`PhotoImg`), danh sách đầy đủ ở trang `#credits` (link ở footer). Người dùng đã loại các ảnh: hồ bơi, bãi cỏ dù lá, lối gỗ, du khách đi dạo, Vũng Ngán — không dùng lại. **Ảnh chỉ dùng làm nền/minh họa cho một cảnh, không làm section riêng để trưng ảnh**; ảnh không dùng thì xoá.

- Định hướng và phân tích trang tham khảo: `design/DESIGN-DIRECTION.md`.
- Token màu/font nằm trong `src/styles/tokens.css`; mọi màu và font phải đi qua token. Font: Be Vietnam Pro (chữ), JetBrains Mono (chỉ số liệu).
- Section "Một ngày" vẽ từ dữ liệu của demo (`src/data/day.ts`, kịch bản cơ sở seed 42); cuộn theo từng mốc 3 giờ (06→24), snap mỗi lần cuộn một mốc (snap tắt quán tính). Dữ liệu này là **minh họa** — luôn gắn nhãn, không trích số trong phần chữ.
- Song ngữ: **mặc định tiếng Anh**, có tiếng Việt. Từ điển ở `src/i18n/dict.ts`, chọn ngôn ngữ qua `?lang=vi` hoặc nút EN/VI (lưu localStorage). Mọi chuỗi mới phải có đủ hai ngôn ngữ.
- Hiệu ứng: **không sao chép nguyên hiệu ứng của trang tham khảo** (chỉ học style, cách sắp xếp). Khi cần hiệu ứng, lấy từ **React Bits** (https://reactbits.dev, giấy phép MIT + Commons Clause).
- GREEN-X: logo trắng (chỉ có bản trắng) đặt trên nền `#134D8B`; trích nguyên văn thông điệp chính thức.
- Quan hệ (đã chốt 27/10/2026): **dự án thuộc GREEN-X, VinUni** — tên đầy đủ "Trung tâm Chuyển đổi xanh Thông minh (GREEN-X), Trường Đại học VinUni".
- Email liên hệ hợp tác: `greenx@vinuni.edu.vn` (nút "Liên hệ hợp tác" và footer).

## Quy ước làm việc

- Ngôn ngữ: mặc định tiếng Anh, có bản tiếng Việt đầy đủ (app demo có VI/EN/RU).
- Mọi số liệu thực tế về Hòn Tre/Vinpearl đưa lên web phải có nguồn đáng tin hoặc được người dùng xác nhận.
- Hỏi lại người dùng trước khi thêm nội dung nằm ngoài danh sách "Nên đưa lên".
