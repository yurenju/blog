const baseUrl = process.env.CF_PAGES_URL || "http://localhost:3000";

export const siteConfig = {
  title: "Yuren's Blog",
  description:
    "撰寫就是一種思考方式，發佈與分享只是副產品，而真正的意義是在自我的知識脈絡裡面有了歸屬與連結。",
  id: baseUrl,
  link: baseUrl,
  language: "zh-tw",
  image: `${baseUrl}/logo.jpg`,
  favicon: `${baseUrl}/favicon.ico`,
  copyright: "All rights reserved 2023, Yuren",
};