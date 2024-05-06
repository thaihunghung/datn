# Sử dụng một image có sẵn của Node.js với phiên bản bạn muốn
FROM node:18.18.0

# Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép file package.json và package-lock.json (nếu có) vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependencies từ package.json
RUN npm install

# Sao chép toàn bộ mã nguồn của ứng dụng vào thư mục làm việc
COPY . .

# Biên dịch ứng dụng ReactJS
RUN npm run build

# Mở cổng mà ứng dụng sẽ lắng nghe trên container (chúng ta không cần mở cổng này vì ứng dụng ReactJS đã được biên dịch và không chạy server trong container)
EXPOSE 3000

# Khởi chạy ứng dụng khi container được chạy
CMD ["npm", "start"]
