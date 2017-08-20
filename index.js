	var MyForm = {};
	MyForm.validate = function(){
		var NotValidFields = [];
		//Валидация ФИО
		var FioValue = $("[name='fio']").val().split(" ");
		if (FioValue.length != 3)
			NotValidFields.push("fio");
		
		//Валидация E-mail
		var EmailValue = $("[name='email']").val();
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;		
		
		var allowedDomains = ["ya.ru", "yandex.ru", "yandex.ua", "yandex.by", "yandex.kz", "yandex.com" ];
		var domain = EmailValue.split("@")[1];
		if (!re.test(EmailValue) || $.inArray(domain, allowedDomains) == -1)
			NotValidFields.push("email");
		
		//Валидация телефона 
		var PhoneValue = $("[name='phone']").val();
		var phoneRegexp = /^\+7\(\d{3}\)\d{3}\-{1}\d{2}\-{1}\d{2}$/;//+7(999)999-99-99
		if(!phoneRegexp.test(PhoneValue))
			NotValidFields.push("phone"); 
		else{
			var numbs = PhoneValue.match(/\d/g);
			var sum = 0;
		
			numbs = numbs.join("");
			for (var i = 0; i < numbs.length; i++) {
				sum += parseInt(numbs.charAt(i), 10);
			}
			numbs = sum.toString();
			if(sum > 30){
				NotValidFields.push("phone");
			}
		}
		return {
			isValid:NotValidFields.length > 0 ? false: true,
			errorFields:NotValidFields 
		}
	};
	MyForm.getData = function(){
		var result={};
		$("input[type='text']").each(function(index,item){
			item = $(item);
			result[item.attr("name")] = item.val();
		});
		return result;
	};

	MyForm.setData = function(obj){
		var existedFields = ["phone", "fio", "email"];
		for(var i in existedFields){
			if(typeof(obj[existedFields[i]])!= "undefined")
				$("input[name="+existedFields[i]+"]").val(obj[existedFields[i]]);
		}
		
	};
	
	MyForm.submit = function(){
		$("input[type=text]").removeClass("error");
		var validateResult =  MyForm.validate();
		console.log(validateResult);
		if(validateResult.isValid){
			$("#submitButton").attr("disabled","disabled");
			
			$.ajax({
				url: $("#myForm").attr("action"),
				success: function(data){
					var resCont = $("#resultContainer");
					resCont.removeClass("success error progres");
					switch(data.status){
						case "success":
							resCont.addClass("success");
							resCont.html("Success"); 
						break;
						case "error":
							resCont.addClass("error");
							resCont.html(data.reason); 
						break;
						case "progress":
							resCont.addClass("progres");
							resCont.html("InProgress"); 
							setTimeout(MyForm.submit,data.timeout);
						break;
						default:
							console.log("Неизвестный статус");
						break;
					}
					$("#submitButton").removeAttr("disabled");
				}
			});
			
				
			return false;
			}
		else{
			
			var errorFields = validateResult.errorFields;
			for(var i =0;i< errorFields.length;i++){
				$("[name="+errorFields[i]+"]").addClass("error");
			}
			
			return false;
			
		}
	
		
	};
	
	
$(function(){
	$("[name='phone']").mask("+7(999)999-99-99");
	$("#myForm").submit(MyForm.submit);
});