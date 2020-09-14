<template>
  <el-container id="homepage">
    <el-main>
      <div class="home">
        <h1>数据结构课程设计</h1>
        1853659 叶茂尧
        <br/><br/><br/>
        <el-link type="success" icon="el-icon-help" href="#/sort">算法实现题：排序算法可视化</el-link>
        <br/><br/><br/>
        <el-link type="success" icon="el-icon-help" href="#/josephus">综合应用题：约瑟夫问题</el-link>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  components: {},
};
</script>

<style>
#homepage {
  background-image: url("../assets/background.jpg");
  background-size: cover;
  height: 615px;
  margin-bottom: 0;
}
</style>
