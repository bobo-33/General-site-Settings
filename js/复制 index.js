/*
	作者：offline
	时间：2018-12-12
	描述：
*/
var projectName = "cdsems";

$(function(){
	initUserTable();
	initBaseData();
	
	//初始化验证表单
	$("#dataForm").validate({
		focusInvalid : true,
	    errorPlacement:function(error,element){
            element.tooltip({
                title:error.text()
            }).parent().addClass("has-errors");
        },
        onfocusout: function (element) {
        	$(element).tooltip('destroy');
            $(element).parent().removeClass('has-errors');  
            this.element(element);  
        }  
	});
})

//table
function initUserTable(){
	 //先销毁表格  
    $('#dataTable').bootstrapTable('destroy');  
    //初始化表格,动态从服务器加载数据  
    $('#dataTable').bootstrapTable({
        url: '/'+projectName+'/sys/user/list',  //请求后台的URL（*）
        method: 'post',                     //请求方式（*）
        dataType: "json",					//返回数据类型
        toolbar: '#exampleToolbar',         //工具按钮用哪个容器
        striped: true,                    	//是否显示行间隔色
        cache: false,                      	//是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                  	//是否显示分页（*）
        ajaxOptions: {async: false, timeout: 10000},
        sortOrder: "desc",                  //排序方式
        clickToSelect : false,				// 点击行即可选中单选/复选框
        queryParams: queryParams,			//传递参数（*）
        pageSize: 10,						//页面大小 每页显示条数
        pageNumber: 1,  					//初始化加载第一页，默认第一页
        pageList: [10],		//设置表格每页显示的记录      
        showToggle: false,  				//名片格式
		showColumns: false, 				//显示隐藏列  
		iconSize: "outline",
		icons: {
	        refresh: "glyphicon-repeat",
	        toggle: "glyphicon-list-alt",
	        columns: "glyphicon-list"
	    },
	    showRefresh: false,  	//显示刷新按钮
		singleSelect: false,	//复选框只能选择一条记录
		search: false,			//是否显示右上角的搜索框
		clickToSelect: true,	//点击行即可选中单选/复选框
        queryParamsType : "limit", 	//查询参数组织方式 ，参数格式,发送标准的RESTFul类型的参数请求
        sidePagination: "server",   //分页方式：client客户端分页，server服务端分页（*）    
        silent: true,  			//刷新事件必须设置
        contentType : "application/json", 	//请求数据内容格式 默认是 application/json 自己根据格式自行服务端处理
        onLoadError: function (data) {
        	$('#dataTable').bootstrapTable('removeAll');
			toastr["info"]("info", "没有找到匹配的记录");
		},
		onLoadSuccess: function(){
			
		},
		columns: [{
	            field: 'xh',
	            title: '序号',
	            align:'center',
	            formatter:function(value,row,index){
	                return index+1;
	            }
	        }, {
	            field: 'suId',
	            title: '主键',
	            align:'center',
	            visible: false
	        },{
	            field: 'suUsername',
	            align:'center',
	            title: '用户名'
	        },{
	            field: 'suRealname',
	            align:'center',
	            title: '真实姓名'
	        },{
	            field: 'suSex',
	            title: '性别',
	            align:'center',
	        	formatter: function (value, row, index) {
	        		if(value == "1"){
	        			return "男";
	        		}else{
	        			return "女";

	        		}
	            }  
	        },
	        {
	            field: 'suPhone',
	            align:'center',
	            title: '手机号码'
	        },
	        {
	        	field: 'suEmail',
	        	align:'center',
	        	title: '邮箱'
	        },
	        {
	            field: 'todo',
	            align:'center',
	            title: '操作',
	            width:'80',
	            formatter:function(value,row,index){
	                var e = '<a class="btn btn-origin btn-xs" title="编辑" onclick="updateUser('+row.suId+')"><i class="fa fa-pencil-square-o"></i></a> ';
	                var d = '<a class="btn btn-danger btn-xs" title="删除" onclick="delUser('+row.suId+')"><i class="fa fa-trash"></i></a> ';
	                return e+d;
	            },
	        }]
	});	
}

/**
 * 查询参数
 */
function queryParams(params){ 
	var suUserName = $("#suUsername").val();
	var suPhone = $("#suPhone").val();
	var temp = {
			token : '',
			data :{
				pageSize : params.limit,
				pageNumber :  params.offset,
				suUserName : suUserName ,
				suPhone : suPhone ,
			}
	};
	return temp;
};

//table -- 批量
//获取所有被选中的记录
function add(){
	var rows = $("#dataTable").bootstrapTable('getSelections');
    if (rows.length== 0) {
    	toastr.success("请先选择要删除的记录!");
        return;
    }else{
    	swal({
	        title: "确认删除",
	        text: "删除污染地块基础信息时会同时删除与其关联的初步调查、详细调查、风险评估、风险管控、治理修复、效果评估的数据，确定删除选中的数据？",
	        type: "warning",
	        showCancelButton: true,
	        closeOnConfirm: false,
	        cancelButtonText: "取消",
	        confirmButtonText: "确定",
	        confirmButtonColor: "#ec6c62"
	    }).then(function(result){
			  if(result == true) {
				  //删除数据
				  var arr=[];
			    	$.each(rows, function (i,v) {
			            arr.push(v.cid)
			        })
			        ajaxPost('/' + projectName + '/ContaminatedLandController/deleteContaminatedLandBatch', {data: arr.join(",")}).done(function (data) {
			            if (data.status == 0) {
			                swal("成功删除选中污染地块", "", "success");
			                initTable(); 
			            } else {
			                swal("删除污染地块", "", "error");
			            }
			            
			        });		       
			  }
	    })
    }
	
}
   
//日期
function initBaseData(){
	$('#date').datetimepicker({
		language:  'zh-CN',  //日期
		minView : "2",//最精确的视图，day
		autoclose : true,
		format : "yyyy-mm-dd"
	});
}

//表单提交
function submit(){
	if($("#dataForm").valid()){
		var data = $("#dataForm").serializeObject();
		console.log(data)
		$.ajax({
			url: '/' + projectName + '/company/insert',
			type:"post",
			contentType: 'application/json;charset=utf-8',
			dataType:"json",
			data:JSON.stringify({
				"token":"",
				"data":data
			}),
			success:function(data){
				if(data.status == '0'){
					toastr.success("添加成功！");
					window.location.href = "#companyList";
				}else{
					toastr.warning(data.msg);
				}
			}
		});
	}
}