<template>
  <div class="test-table">
    <div class="toolbar">
      <h2>Table UI</h2>
    </div>
    <hr class="divider" />
    <div class="test-actions">
      <div class="sort-by">
        <span class="sort-title">
          Сортировать по:
        </span>
        <div class="sort-btn">
          <span
            class="chip-btn"
            v-for="(item, index) in hTable"
            :key="item.jTitle + index"
            @click="clickSbChip(item)"
            :class="item.sb ? 'active-chip' : ''"
          >
            <span class="chip-content">
              {{ item.ruTitle }}
            </span>
          </span>
        </div>
      </div>
      <div class="table-settings">
        <button
          type="button"
          class="total-remove-btn idd-btn"
          :class="selProducts.length > 0 ? 'green-active' : 'disabled'"
          style="margin-right: 12px;"
          :disabled="selProducts.length === 0 ? true : false"
          @click="delProduct($event)"
        >
          <span class="total-remove-btn"
            >Удалить &nbsp;
            <span
              class="total-remove-btn total-remove"
              v-show="selProducts.length > 0"
            >
              ({{ selProducts.length }})
            </span>
          </span>
        </button>
        <test-select
          :items="numDispPages"
          itemText="text"
          v-model="selNumDisPages"
        >
        </test-select>
        <div class="pagination-table">
          <button
            type="button"
            :class="numPage === 1 ? 'disabled' : ''"
            :disabled="numPage === 1 ? true : false"
            class="idd-btn-square outlined"
            @click="pagTable('prev')"
          >
            <span class="btn-icon">
              <img src="/img/chevron/Left.svg" alt="" />
            </span>
          </button>
          <span class="page-table-text">
            {{ numPage }} из {{ totalPage }}
          </span>
          <button
            type="button"
            :class="numPage === totalPage ? 'disabled' : ''"
            :disabled="numPage === totalPage ? true : false"
            class="idd-btn-square outlined"
            @click="pagTable('next')"
          >
            <span class="btn-icon">
              <img src="/img/chevron/right.svg" alt="" />
            </span>
          </button>
        </div>
        <test-select
          :customValue="totSelCol"
          :items="hTable"
          itemText="ruTitle"
          multiple
          :selAllPosState="showAllColState"
        >
          <div class="idp-select-list">
            <div class="idp-select-item" >
              <div class="idp-checkbox">
                <test-check-box :value="!showAllColState" @checkbox="showAllCol"></test-check-box>
              </div>
              <span class="idp-list-title" v-if="showAllColState" style="cursor: default;">Выбрать все</span>
              <span class="idp-list-title" v-else style="cursor: default;">Скрыть все</span>
            </div>
            <div
              class="idp-select-item"
              style="cursor: default;"
              v-for="(item, index) in hTable"
              :key="'vse' + Math.random() + index"
            >
              <div class="idp-checkbox" style="cursor: pointer">
                <test-check-box v-model="item.show"></test-check-box>
              </div>
              <span class="idp-list-title">
                {{ item.ruTitle }}
              </span>
            </div>
          </div>
        </test-select>
      </div>
    </div>
    <div class="table">
      <table class="idp-table table-striped">
        <thead>
          <tr>
            <th class="table-checbox">
              <!-- TODO: Сделать выделение первых 10 записей -->
              <!-- <test-check-box></test-check-box> -->
            </th>
            <th v-for="(item, index) in hTableShow" :key="item.ruTitle + index">
              {{ item.ruTitle }}
              <span style="cursor: pointer" @click="sortUp = !sortUp" v-show="item.sb">
                <i
                  :class="sortUp ? 'fa-arrow-up' : 'fa-arrow-down'"
                  class="fas" style="margin-left: 10px;">
                </i>
              </span>
              <!-- <span class="sort-arrow"><img src="/img/Arrow/up.svg" /></span> -->
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in products"
            :key="'vss' + index"
            @click="checkProducts(item, $event)"
          >
            <td class="table-checbox">
              <test-check-box
                :value="item.check"
                @checkbox="checkProducts(item)"
              ></test-check-box>
            </td>
            <td
              v-for="(col, index) in hTableShow"
              :key="'vs' + index + col.ruTitle">
              {{ item[col.jTitle] }}
            </td>
            <td>
              <span class="deleteBtn" @click="delProduct($event, item, true)"
                ><img src="/img/Trash.svg" class="deleteBtnImg" />Удалить</span
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="confirm-popup"
      ref="confPopUp"
      v-show="confirmDel"
      v-click-outside="hideMenu"
    >
      <div class="confirm-action-body">
        <h5>{{ textDelWindow }}</h5>
        <div class="error-messages" v-if="delErrorMes">{{ delErrorMes }}</div>
        <div class="confirm-action">
          <button
            type="button"
            class="idd-btn outlined"
            style="margin-right: 12px"
            @click="confirmDel = false"
          >
            Отменить
          </button>
          <button type="button" class="idd-btn green-active"
          @click="delProductReq()">
            Удалить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TestSelect from '@/components/TestSelect.vue';
import TestCheckBox from '@/components/TestCheckBox.vue';
import ClickOutside from 'vue-click-outside';
import { deleteProducts } from "../testApp/request";

export default {
  directives: {
    ClickOutside
  },
  components: {
    TestSelect,
    TestCheckBox,
  },
  props: {
    msg: String
  },
  data() {
    return {
      multipleRemoval: false,
      bufferDel: undefined,
      confirmDel: false,
      testCheckBox2: true,
      delErrorMes: '',
      selProducts: [],
      sortUp: false,
      numPage: 1,
      selNumDisPages: { value: 10, text: '10 позиций' },
      numDispPages: [
        { value: 10,text: '10 позиций' },
        { value: 15, text: '15 позиций' },
        { value: 20, text: '20 позиций' }
      ],
      hTable: [
        { ruTitle: 'Продукт (Порц 100гр)', jTitle: 'product', sb: false, show: true },
        { ruTitle: 'Калории', jTitle: 'calories', sb: false, show: true },
        { ruTitle: 'Жиры(гр)', jTitle: 'fat', sb: false, show: true },
        { ruTitle: 'Углеводы(гр)', jTitle: 'carbs', sb: false, show: true },
        { ruTitle: 'Белки(гр)', jTitle: 'protein', sb: false, show: true },
        { ruTitle: 'Железо(%)', jTitle: 'iron', sb: false, show: true },
      ]
    }
  },
  computed: {
    hTableShow() {
      return this.hTable.filter(item => item.show);
    },
    // Всего выбранных колонок
    totSelCol() {
      let total = 0;
      this.hTable.forEach(item => {
        if (item.show) total += 1;
      });
      return `Выбрано всего ${total} колонок`;
    },
    products() {
      let productJson = this.$store.state.products;

      let products = [];
      if (productJson.length > 0) {
        if (this.sortBy) {
          if (!this.sortUp) {
            productJson = productJson
              .slice()
              .sort((a, b) =>
                a[this.sortBy] !== b[this.sortBy]
                  ? a[this.sortBy] < b[this.sortBy]
                    ? -1
                    : 1
                  : 0
              );
          } else {
            productJson = productJson
              .slice()
              .sort((a, b) =>
                a[this.sortBy] !== b[this.sortBy]
                  ? a[this.sortBy] > b[this.sortBy]
                    ? -1
                    : 1
                  : 0
              );
          }
        }
        for (let i = this.startEndRec.start; i < this.startEndRec.end; i++) {
          let resetObject = productJson[i];
          resetObject.check = false;
          if (this.selProducts.length > 0) {
            for (let j = 0; j < this.selProducts.length; j++) {
              if (resetObject === this.selProducts[j]) {
                resetObject.check = true;
              }
            }
          }
          products.push(resetObject);
        }
      }
      return products;
    },
    sortBy() {
      let sortBy = this.hTable.find(el => el.sb);
      return sortBy ? sortBy.jTitle : null;
    },
    showAllColState() {
      for (let i = 0; i < this.hTable.length; i++) {
        if (!this.hTable[i].show) return true;
      }
      return false;
    },
    totalPage() {
      const products = this.$store.state.products;
      return products
        ? Math.floor(products.length / this.selNumDisPages.value)
        : null;
    },
    startEndRec() {
      let sObj = {
        start: 0,
        end: 0
      };
      sObj.start = (this.numPage - 1) * this.selNumDisPages.value;
      sObj.end = sObj.start + this.selNumDisPages.value;
      return sObj;
    },
    textDelWindow() {
      let inTemp = '';
      if (!this.multipleRemoval && this.bufferDel) {
        inTemp = `элуемент "${this.bufferDel.product}"`;
      } else if (this.multipleRemoval) {
        if (this.selProducts.length === 1) {
          inTemp = `${this.selProducts.length} элемент`;
        } else {
          inTemp = `${this.selProducts.length} элемента`;
        }
      }
      let template = 'Вы уверены что хотите удалить ' + inTemp + '?';
      return template;
    },
  },
  methods: {
    hideMenu(event) {
      if (
        event.target.classList[0] !== "deleteBtn" &&
        event.target.classList[0] !== "deleteBtnImg" &&
        event.target.classList[0] !== "total-remove-btn"
      ) {
        this.confirmDel = false;
      }
    },
    checkProducts(position, event) {
      if (event && event.target.classList[0] === 'deleteBtn') return;
      var delProducts = false;
      for (let i = 0; i < this.selProducts.length; i++){
        if (this.selProducts[i] === position) {
          this.selProducts.splice(i, 1);
          delProducts = true;
          break;
        }
      }
      if (!delProducts) this.selProducts.push(position);
    },
    showAllCol() {
      const statePos = this.showAllColState;

      this.hTable.forEach(item => {
        item.show = statePos;
      });
    },
    pagTable(option) {
      if (option === 'next') this.numPage += 1;
      else if (option === 'prev') this.numPage -= 1;
    },
    clickSbChip(item) {
      item.sb = !item.sb;
      
      // По условию мы можем сортировать только одну колонку,
      // поэтому делаем возможность сортировки только по одной

      this.hTable.forEach(el => {
        if (item.jTitle !== el.jTitle) {
          el.sb = false;
        }
      });
    },
    delProductReq() {
      if (this.multipleRemoval) {
        deleteProducts()
          .then(() => {
            this.$store.commit('removeProducts', this.selProducts);
            this.confirmDel = false;
            this.selProducts = [];
          })
          .catch(() => {
              this.delErrorMes = 'Ошибка сервера, повторите попытку';
          });
      } else {
        deleteProducts()
          .then(() => {
            this.confirmDel = false;
            if (this.selProducts !== 0) {
              for (let i = 0; i < this.selProducts.length; i++) {
                if (this.selProducts[i].id === this.bufferDel.id)
                  this.selProducts.splice(i, 1);
              }
            }
            // this.selProducts.forEach((item, index) => {
            //   if (item === this.bufferDel) this.selProducts(index, 1);
            // });
            this.$store.commit('removeProducts', [ this.bufferDel ]);
          })
          .catch(() => {
              this.delErrorMes = 'Ошибка сервера, повторите попытку';
          });
      }
    },
    
    delProduct(event, el, single) {
      // TODO: Дописать алгоритм для репозиционирования,
      //  если Поп-ап выходит за границы видимости
      if (single) {
        this.multipleRemoval = false;
        this.bufferDel = el;
      } else {
        this.multipleRemoval = true;
      }
      // Пока сделал так, чтобы при каждом открытие окна, ошибка была убрана;
      this.delErrorMes = '';

      const et = event.currentTarget;
      const confWindow = this.$refs.confPopUp;

      const getCoords = elem => {
        const box = elem.getBoundingClientRect();
        return {
          top: box.top + pageYOffset,
          left: box.left + pageXOffset
        }
      };

      // console.log(`${x} - ${y} - ${confWindow} - ${confWindow.offsetWidth}`);

      this.confirmDel = true;

      let x = Math.round(getCoords(et).left - (255 / 2));
      let y = Math.round(getCoords(et).top + (et.offsetHeight) + 10);


      confWindow.style.top = `${y}px`;
      confWindow.style.left = `${x}px`;
    },
  },
  watch: {
    selNumDisPages: function() {
      this.numPage = 1;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.confirm-popup {
  width: 255px;
  max-width: 255px;
  position: absolute;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16);
  .confirm-action-body {
    padding: 16px;
    text-align: center;
    .error-messages {
      font-size: 12px;
      color: red;
      margin-bottom: 12px;
    }
    h5{
      font-size: 14px;
      margin: 0;
      margin-bottom: 12px;
      padding: 0;
    }
  }
}
.table-settings {
  display: flex;
}
.test-actions {
  padding: 28px 0;
}
.sort-title{
  font-weight: bold;
}
$greenColor: #00a11e;
.pagination-table {
  margin: 0 16px;
  .page-table-text{
    padding: 0px 12px;
  }
}
.test-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
// TODO: Сделать наследование класса
.idd-btn-square {
  width: 27px;
  height: 27px;
  padding: 0;
  margin: 0;
}
.disabled {
  color: #C6CBD4;
}
.outlined {
  color: #5B5E77;
}
.disabled,
.outlined {
  background: transparent;
  border: 1px solid #C6CBD4;
  border-radius: 2px;
  cursor: pointer;
  &:focus {
    outline: none;
  }
}
.disabled img {
  opacity: 50%;
}
.green-active {
  background: $greenColor;
  border: 1px solid $greenColor;
  color: white;
}
.idd-btn {
  height: 27px;
  border-radius: 2px;
  padding: 0 16px;
  cursor: pointer;
}
.pagination-table{
  display: flex;
  align-items: center;
}
.divider {
  display: block;
  flex: 1 1 0px;
  max-width: 100%;
  height: 0;
  max-height: 0;
  border: solid;
  border-width: thin 0 0;
  transition: inherit;
  border-color: #EDEDED;
}
.sort-by {
  display: flex;
  font-size: 14px;
  .chip-btn {
    border-radius: 2px;
    padding: 6px 12px;
    margin-left: 10px;
    cursor: pointer;
    &:hover {
      background: $greenColor;
      color: white;
    }
  }
  .active-chip {
    background: $greenColor;
    color: white;
  }
}
.idp-table {
  border-collapse: collapse;
  width: 100%;
  font-size: 14px;
  text-align: left;
  background: white;
  .deleteBtn {
    transition: 0s !important;
    visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 1px solid #d5dae0;
    height: 27px;
    border-radius: 2px;
  }
  tr {
    th,
    td {
      padding: 0.75rem;
    }
  }
  tbody tr {
    cursor: pointer;
    &:nth-of-type(odd) {
      background-color: rgba(0, 0, 0, 0.05);
    }
    &:hover {
      background: #EDF8EF;
      .deleteBtn{
        visibility: visible;
      }
    }
  }

  .table-checbox,
  .table-actions {
    text-align: center;
  }
}
</style>
