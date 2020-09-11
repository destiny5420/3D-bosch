module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/3D-bosch/" : "/",
  outputDir: "docs",
  chainWebpack: config => {
    config.resolve.alias.set("style", resolve("src/common/style"));
  }
};
