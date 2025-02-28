# ใช้ Node.js เวอร์ชัน 18
FROM node:18

# กำหนดโฟลเดอร์ทำงาน
WORKDIR /app

# คัดลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมดไปยัง container
COPY . .

# กำหนดพอร์ต
EXPOSE 3000

# รันเซิร์ฟเวอร์
CMD ["node", "index.js"]
