<script lang="ts" setup></script>

<template>
  <div class="Directory-wrap">
    <div class="container-box">
      <div class="container">
        <div class="header">
          <div class="header-left">
            <div class="bookIcon">
              <img src="src/assets/icons/bookIcon.svg" alt="" class="bookIcon" />
            </div>
            <span>11111111</span>
          </div>
          <div class="header-right">
            <div class="button-wrap">
              <div class="button">
                <img src="@/assets/icons/startIcon.svg" alt="" />
                <span>收藏</span>
              </div>
              <div class="button">
                <span>分享</span>
              </div>
              <div class="button moreIcon">
                <img src="@/assets/icons/moreIcon1_after.svg" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div class="count">
          <span><b>0</b>文档</span>
          <span><b>0</b>字</span>
        </div>
        <div class="welcome">
          <div class="welcome-item">
            <!--空格-->
            <span> 👋 &ensp;</span>
            <span style="font-weight: 700">欢迎来到知识库</span>
          </div>
          <div class="welcome-item left">
            <span>知识库就像书一样，让多篇文档结构化，方便知识的创作与沉淀</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Directory-wrap {
  padding: 0;
  width: 100%;
  min-height: calc(100vh - 60px);
  will-change: padding-left;
  background: linear-gradient(rgba(255, 255, 255, 0) 0px, rgb(255, 255, 255) 70vh, rgb(255, 255, 255) 100%), url('@/assets/img/cover.png') center top / 100% no-repeat;
  .container-box {
    padding: 64px 32px 0 32px;
    min-height: 100vh;
    position: relative;
    box-sizing: border-box;
    .container {
      max-width: 1024px;
      background: hsla(0, 0%, 100%, 0.9);
      border-radius: 12px;
      padding: 32px;
      min-height: calc(100vh - 64px);
      margin: 0 auto;
      box-sizing: border-box;
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 48px;
        .header-left {
          display: flex;
          align-items: center;
          height: 44px;
          .bookIcon {
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              width: 38px;
              min-width: 38px;
              height: 38px;
            }
          }
          span {
            font-size: 28px;
            font-weight: 700;
            margin-left: 18px;
            font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
              sans-serif;
          }
        }
        .header-right {
          display: flex;
          align-items: center;
          .button-wrap {
            display: flex;
            align-items: center;
            .button {
              display: flex;
              align-items: center;
              border: 1px solid #e7e9e8;
              border-radius: 6px;
              text-align: center;
              padding: 7px 14px;
              min-width: 32px;
              height: 32px;
              margin: 0 0 0 12px;
              cursor: pointer;
              box-sizing: border-box;
              img {
                width: 16px;
                height: 16px;
                margin-right: 6px;
              }
              span {
                font-size: 14px;
                font-weight: 700;
                line-height: 20px;
              }
              &:hover {
                background-color: #fafafa;
              }
            }

            .moreIcon {
              padding-left: 7px;
              padding-right: 7px;
              img {
                margin-right: 0px;
              }
            }
          }
        }
      }
      .count {
        margin: 6px 0 6px 58px;
        height: 28px;
        display: flex;
        align-items: center;
        span {
          font-size: 14px;
          color: #8a8f8d;
          text-align: center;
          margin-right: 33px;
          b {
            color: #585a5a;
            font-family: DIN Alternate Bold, Pingfang SC, Hiragino Sans GB, Helvetica, Droid Sans, Microsoft YaHei, Arial, sans-serif;
            font-size: 18px;
            margin-right: 8px;
            font-weight: 700;
          }
        }
      }
      .welcome {
        margin-top: 60px;
        &-item {
          min-height: 24px;
          margin-bottom: 8px;
          font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Segoe UI';
          span {
            font-size: 15px;
          }
        }
        .left {
          text-indent: 2em;
        }
      }
    }
  }
}
</style>
