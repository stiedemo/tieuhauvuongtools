<template>
  <div class="panel panel-primary">
    <div class="panel-heading">
      <h3 class="panel-title">Công cụ chuyển đổi hệ số Đếm</h3>
    </div>
    <div class="panel-body">
      <form action="" method="POST" role="form">
        <legend>Form Convert</legend>

        <div class="col col-sm-6">
          <div class="form-group">
            <label for="number-convert">Numper Convert</label>
            <input v-model="numChange" type="text" class="form-control" id="number-convert" placeholder="Number convert input ?">
          </div>
        </div>
        <div class="col col-sm-6">
          <div class="form-group">
            <label for="number-type">Numper Type</label>
            <select v-model="selectType" id="number-type" class="form-control">
              <option v-for="list in listConvert" v-bind:value="list.code">{{ list.name }} ({{ list.code }})</option>
            </select>
          </div>
        </div>


        <div class="text-center">
          <input v-on:click="convert()" type="button" class="btn btn-primary" v-bind:value="contentButton">
        </div>
      </form>

      <table v-if="isBoxReturn" class="table table-bordered table-hover table-return">
        <thead class="bg-success">
          <tr>
            <th class="text-center" width="20%">Type Convert</th>
            <th class="text-center">Return</th>
            <th class="text-center" width="10%">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in dataResult">
            <td>{{ data.code }}</td>
            <td>{{ data.result.value }}</td>
            <td><button class="btn btn-sm btn-info" data-toggle="modal" data-target="#viewResult" v-on:click="viewResult(data.result)"><i class="glyphicon glyphicon-eye-open"></i></button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal fade" id="viewResult" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span>
                    </button>
                    <h4 class="modal-title" id="myModalLabel">Kết quả chi tiết phép biến đổi số {{ numChange }}</h4>
                </div>
                <div class="modal-body">
                  Các lần chia để có được kết quả biến đổi : <i>{{ viewResultLog.value }}</i> là:
                  <p></p>
                  <p v-for="(text_log, index) in viewResultLog.log"><b>Lần chia thứ {{ index + 1 }}</b>: <span class="text-danger"> {{ text_log }} </span></p>
                  <p>Cuối cùng ta lấy ngược các số dư thì sẽ thu được kết quả biến đổi là : {{ viewResultLog.value }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Đóng</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isBoxReturn: true,
      isWriteLog: true,
      contentButton: 'Hidden Return',
      selectType: 'DEC',
      numChange: undefined,
      viewResultLog: [],
      dataResult: [],
      listConvert : [
        {
          value : 0,
          code: 'DEC',
          name : 'Thập Phân'
        },
        {
          value : 1,
          code: 'BIN',
          name : 'Nhị Phân'
        },
        {
          value : 3,
          code: 'OCT',
          name : 'Bác Phân'
        },
        {
          value : 4,
          code: 'HEX',
          name : 'Thập Lục Phân'
        }
      ]
    }
  },
  watch: {
    isBoxReturn: function(val) {
      if(val) {
        this.contentButton = 'Hidden Return';
      }else{
        this.contentButton = 'View Return';
      }
    },
    numChange: function(val) {
      this.setDataResult(val);
    }
  },
  methods : {
    convert: function () {
      this.isBoxReturn = !this.isBoxReturn;
    },
    convertTO: function (code, toCode, number) {
      var rs = null;
      switch(toCode){
        case 'DEC' : {
          switch (code) {
            case 'BIN': rs=  this.DEC_BIN(number)

            break;
            case 'OCT': rs=  this.DEC_OCT(number)

            break;
            case 'HEX': rs=  this.DEC_HEX(number)

            break;
            case 'DEC': rs=  number

            break;
          }
        }
        break;
        case 'BIN' : {
          switch (code) {
            case 'DEC': rs=  this.BIN_DEC(number)

            break;
            case 'OCT': rs=  this.DEC_OCT(this.BIN_DEC(number).value)

            break;
            case 'HEX': rs=  this.DEC_HEX(this.BIN_DEC(number).value)

            break;
            case 'BIN': rs=  number

            break;
          }
        }
        break;
        case 'OCT' : {
          switch (code) {
            case 'DEC': rs=  this.OCT_DEC(number)

            break;
            case 'BIN': rs=  this.DEC_BIN(this.OCT_DEC(number).value)

            break;
            case 'HEX': rs=  this.DEC_HEX(this.OCT_DEC(number).value)

            break;
            case 'OCT': rs=  number

            break;
          }
        }
        break;
        case 'HEX' : {
          switch (code) {
            case 'DEC': rs=  this.HEX_DEC(number)

            break;
            case 'BIN': rs=  this.DEC_BIN(this.HEX_DEC(number).value)

            break;
            case 'OCT': rs=  this.DEC_OCT(this.HEX_DEC(number).value)

            break;
            case 'HEX': rs=  number

            break;
          }
        }
      }
      return rs;
    },
    setDataResult: function (number) {
      var setup = null;
      this.dataResult = [];
      this.listConvert.forEach(val => {
        setup = {
          code : val.code,
          result : this.convertTO(val.code, this.selectType, number)
        };
        this.dataResult.push(setup);
      });
    },
    writeLogDEC: function(number, code)  {
        if(this.isWriteLog){
          return number + ' Chia ' + code + ' = ' + number + ' Dư ' + (number % code);
        }
    },
    DEC_BIN: function (number) {
      var result = '';
      var logs = [];
      while(number > 0) {
        logs.push(this.writeLogDEC(number, 2));
        result = (number % 2) + '' + result;
        number = parseInt(number / 2);
      }
      this.isWriteLog = true;
      return {
        value : result,
        log : logs
      };
    },
    DEC_OCT: function (number) {
      var result = '';
      var logs = [];
      while(number > 0) {
        logs.push(this.writeLogDEC(number, 8));
        result = (number % 8) + '' + result;
        number = parseInt(number / 8);
      }
      this.isWriteLog = true;
      return {
        value : result,
        log : logs
      };
    },
    DEC_HEX: function (number) {
      var result = '';
      var check = [];
      var logs = [];
      for (let index = 0; index <= 9; index++) {
        check[index] = index;
      }
      let codeStart = 65;
      for (let index = 10; index <= 15; index++) {
        check[index] = String.fromCharCode(codeStart);
        codeStart ++ ;
      }
      while(number > 0) {
        logs.push(this.writeLogDEC(number, 16));
        result = check[(number % 16)] + '' + result;
        number = parseInt(number / 16);
      }
      this.isWriteLog = true;
      return {
        value : result,
        log : logs
      };
    },
    BIN_DEC: function (number) {
      this.isWriteLog = false;
      var result = null;
      var i = 0;
      var logs = [];
      number = String(number);
      number = number.split('').reverse();
      number.forEach(num => {
        result += num * Math.pow(2, i);
        i++;
      });
      return {
        value : result,
        log : logs
      };
    },
    OCT_DEC: function (number) {
      this.isWriteLog = false;
      var logs = [];
      number = String(number);
      number = number.split('').reverse();
      var result = null;
      var i = 0;
      number.forEach(num => {
        result += num * Math.pow(8, i);
        i++;
      });
      return {
        value : result,
        log : logs
      };
    },
    HEX_DEC: function (number) {
      this.isWriteLog = false;
      var logs = [];
      var check = [];
      for (let index = 0; index <= 9; index++) {
        check[index] = index;
      }
      let codeStart = 65;
      for (let index = 10; index <= 15; index++) {
        check[String.fromCharCode(codeStart)] = index;
        codeStart ++ ;
      }
      number = String(number);
      number = number.split('').reverse();
      var result = null;
      var i = 0;
      number.forEach(num => {
        result += check[num] * Math.pow(16, i);
        i++;
      });
      return {
        value : result,
        log : logs
      };
    },
    viewResult: function(logs) {
      this.viewResultLog = logs;
    }
  }
}
</script>
