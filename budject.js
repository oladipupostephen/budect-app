/*var budjectcontroller = (function(){
var x = 25;
var add = function(a){
    console.log(x+a);
    return x +a ;
}
//naturall the budjectcontroller cant access x variable and add function

//the concept of module pattern is used here.
//module pattern works due to closures. this helps the publictest to access the 
//add function and x variable can be accessed b the publictest method
//module pattern enables the budjectcontroller to access the publictest
//this means the budjectcontroller becomes an object with method of publictest.
return{
    publictest: function(b){
return add(b);
    }
}
})();

var UIcontroller = (function(){
})();

//module pattern interacting with one
var controller = (function(budjectCTRL, UIctrl){
var z = budjectcontroller.publictest(6);
return{
    publiccontroller: function (){
        console.log(z);
    }
}
})(budjectcontroller, UIcontroller);*/

//budject controller is used to calculate and store ui input data structure
var budjectcontroller = (function(){
//function constructors created.    
var data;//this stores the data structure
//expense stores each expenses data
var Expense = function(id,description,value){
this.id = id;
this.description = description;
this.value = value;
this.percentage = -1;};
//object to calculate the percentage
Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
        this.percentage = -1;
    }
};
//object to get the percentage
Expense.prototype.getPercentage = function() {
    return this.percentage;
};
//object to store each income
var Income = function(id,description,value){
    this.id = id;
    this.description = description;
    this.value = value;}
//stores the income and expenditure data structure    
 data = {
allitems:{
            exp :[],
            inc : []
        },
totals:{
            exp : 0,
            inc :0
        }
        ,
        budget: 0,
        percentage: -1
    };
 //calculating the total sum of income or expenditure according to the input tpe.
 //calculatetotal is used to send values into the data variable   
var calculateTotal = function(type) {
var sum = 0;
//using the for each method to loop through each value of inc or exp of the data        
data.allitems[type].forEach(function(cur) {
//finding the sum of each value from the data            
sum += cur.value;});
//storing the sum of income or expenditure in the data.        
data.totals[type] = sum;
    };
    
    
return{
additem:function(type, des ,val) {
var newitem , ID;
if(data.allitems[type].length > 0){
    ID = data.allitems[type][data.allitems[type].length - 1].id +1 ;
}
else{
    ID =0;
}
//create a new item based on the type
if (type==='exp'){
newitem = new Expense(ID , des ,val);
}
else if (type === 'inc'){
newitem = new Income(ID, des ,val);
}
//pushing the new item into the data structure
//storing each newitem into he data structure
data.allitems[type].push(newitem);
//return the new item so other modules can access the newitem
return newitem;
},

deleteItem: function(type, id){
 var ids, index;
    // id = 6
//data.allItems[type][id];
// ids = [1 2 4 6  8]
//index = 3
//note that the id passed from the app controller is the position of the item we want to delete.
//to delete this item we have to return the specific arra at this time using map function. 
//map function returns the specific arra           
    ids = data.allitems[type].map(function(current) {
        return current.id;
    });
console.log(ids);
index = ids.indexOf(id);
console.log(index);
//since index is -1 if the id passed is not present
if (index !== -1) {
//1 is the number of element we want to delete.
//we removed the element using the splice method.
data.allitems[type].splice(index,1);
    }

},

calculateBudget: function() {
// calculate total income and expenses
    calculateTotal('exp');
    calculateTotal('inc');
    
// Calculate the budget: income - expenses
data.budget = data.totals.inc - data.totals.exp;
    
// calculate the percentage of income that we spent
    if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
    } else {
        data.percentage = -1;
    }            
// Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 * 100
},
getBudget: function() {
    return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
    };
},

calculatePercentages: function() {
    /*
    a=20
    b=10
    c=40
    income = 100
    a=20/100=20%
    b=10/100=10%
    c=40/100=40%
    */
 //using the for each method to calculate the percentage of each income out of the total income.  
    data.allitems.exp.forEach(function(cur) {
       cur.calcPercentage(data.totals.inc);
    });
},


getPercentages: function() {
    var allPerc = data.allitems.exp.map(function(cur) {
        return cur.getPercentage();
    });
    return allPerc;
},
testing:function(){
    console.log(data);
}
};})();
    
//this controlls the user interface
 var UIcontroller = (function(){
//putting the classes in an object
  var domstrings = {
   inputipe : '.add__type',
   inputdes : '.add__description' ,
   inputvalue : '.add__value' ,
   inputbtn : '.add__btn',
   incomeContainer: '.income__list',
   expensesContainer: '.expenses__list',
   budgetLabel: '.budget__value',
   incomeLabel: '.budget__income--value',
   expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'}  ;
//used to loop through a node list
var nodeListForEach = function(list, callback) {
    //allows the inputed code repeat for the list length times
    for (var i = 0; i<list.length; i++) {
        callback(list[i],i);}
};
var formatNumber = function(num, type) {
    var numSplit, int, dec, type;
    /*
        + or - before number
        exactly 2 decimal points
        comma separating the thousands

        2310.4567 -> + 2,310.46
        2000 -> + 2,000.00
        */
//this is to convert the number to an integer       
//math.abs is not needed again
    num = Math.abs(num);
 //to round up the number to 2 decimal places.   
    num = num.toFixed(2);
//to split the number into integer and decimal so we can work with the ineger seperatel for comma
//addition.
numSplit = num.split('.');
//this returns the integer part alone
int = numSplit[0];
//to add comma between the integer when above 3 numbers
if (int.length > 3) {
int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
    }
//returns the numbers after the decimal points.
dec = numSplit[1];
//to add + or - before the number depending on if income or expenditure
return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

};


return{
  //get  all input data from the user interface.
  getinput: function(){
      //in order to let all this variable return at the same time we put everthing in a single object.
      return{
    type:document.querySelector(domstrings.inputipe).value, //either inc or exp
    description:document.querySelector(domstrings.inputdes).value,
    //converts the value into integer.
    value:parseFloat(document.querySelector(domstrings.inputvalue).value)};
} ,
deleteListItem: function(selectorID) {
 //using dom manipulation to remove the item  from the UI           
    var el = document.getElementById(selectorID);
    el.parentNode.removeChild(el);
    
},
//adding items to the user interface
addListItem: function(obj, type) {
    var html, newHtml, element;
    // Create HTML string with placeholder text
    
    if (type === 'inc') {
        element = domstrings.incomeContainer;
        
        html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline">DEL</i></button></div></div></div>';
    } else if (type === 'exp') {
        element = domstrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline">DEL</i></button></div></div></div>';
    }
    
    // Replace the placeholder text with some actual data
    newHtml = html.replace('%id%', obj.id);
    newHtml = newHtml.replace('%description%', obj.description);
    newHtml = newHtml.replace('%value%',formatNumber(obj.value, type));
    
    // Insert the HTML into the DOM
    document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
},
//clearing the input field after clicking enter.
clearFields: function() {
    var fields, fieldsArr;
   //note quer selector all returns a list so we need to convert to an arra 
   //we seperate strings with comma
    fields = document.querySelectorAll(domstrings.inputdes + ', ' + domstrings.inputvalue);
//tricking the arra to accept a list variable    
    fieldsArr = Array.prototype.slice.call(fields);
//using the for each method to delete firldsarr    
    fieldsArr.forEach(function(current, index, array) {
        current.value = "";
    });
//sets the focus to the description        
    fieldsArr[0].focus();
},
displayBudget: function(obj) {
    var type;
    obj.budget > 0 ? type = 'inc' : type = 'exp';
    document.querySelector(domstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
    document.querySelector(domstrings.incomeLabel).textContent = formatNumber(obj.totalInc , 'inc');
    document.querySelector(domstrings.expensesLabel).textContent =formatNumber(obj.totalExp, 'exp')
    if (obj.percentage > 0) {
        document.querySelector(domstrings.percentageLabel).textContent = obj.percentage + '%';
    } else {
        document.querySelector(domstrings.percentageLabel).textContent = '---';}
},
displayPercentages: function(percentages) {
//fields returns a nodelist of all the available expensespercentagelabel.            
    var fields = document.querySelectorAll(domstrings.expensesPercLabel);
//looping trough a nodelist of the fields variable.
    nodeListForEach(fields, function(current, index) {
        
        if (percentages[index] > 0) {
            current.textContent = percentages[index] + '%';
        } else {
            current.textContent = '---';
        }
    });
    
},

displayMonth: function() {
    var now, months, month, year;
    
    now = new Date();
    //var christmas = new Date(2016, 11, 25);
    
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    month = now.getMonth();
    year = now.getFullYear();
    document.querySelector(domstrings.dateLabel).textContent = months[month] + ' ' + year;
},
changedType: function() {
    var fields = document.querySelectorAll(
        domstrings.inputipe + ',' +
        domstrings.inputdes + ',' +
        domstrings.inputvalue);
    
    nodeListForEach(fields, function(cur) {
       cur.classList.toggle('red-focus'); 
    });
 document.querySelector(domstrings.inputbtn).classList.toggle('red');},

//retutn the domstring object to make it public
getdomstrings :function(){
    return domstrings;
} }})();
    
 

//module pattern used to interact between budject and UI controller.
var controller = (function(budjectCTRL, UIctrl){
    //putting event liseners in a variable
var setupeventlisteners = function(){
 //callling the getdomstrings object     
 var dom = UIctrl.getdomstrings(); 
 var test = budjectcontroller.testing();

 console.log(test);
//implementing the domstring object      
document.querySelector(dom.inputbtn).addEventListener('click',additem) ;
//setting up ke press event for enter
document.addEventListener('keypress', function(event){
 if (event.keyCode===13 || event.which===13 ){
     additem();
 }});
//setting up event listener on the container b eventdelegation concept.
//event bubbling is a concept of event delegation which means
//when a target element is triggered it affects the parent elements.
//event bubbles up in the dom tree.
//event delegation is to not set up the event listener to the element we are interested in. but attach it to the parent element.
//so we can catch the element here.
//;;;wh we use event delegation
//1)when we have elementwith lot of child element we are interested in.
//2)when we we want event handler attached to an element not et in the dom when our page is loaded.

//creating the delete item button b event delegation concept.
//here we set up our event listener on the container because its common to the income and expenses
//THE ctrldeleteitem function is called whenever we click.
document.querySelector(dom.container).addEventListener('click', ctrlDeleteItem);
document.querySelector(dom.inputipe).addEventListener('change', UIctrl.changedType);  
 };


 var updatePercentages = function() {
// 1. Calculate percentages
    budjectCTRL.calculatePercentages();
    
    // 2. Read percentages from the budget controller
    var percentages = budjectCTRL.getPercentages();
    console.log(percentages);
    
    // 3. Update the UI with the new percentages
    UIctrl.displayPercentages(percentages);
};

var updateBudget = function() {
    // 1. Calculate the budget
        budjectCTRL.calculateBudget();
     // 2. Return the budget
        var budget = budjectCTRL.getBudget();
        
        // 3. Display the budget on the UI
        UIctrl.displayBudget(budget);

        // 4. Calculate and update percentages
        updatePercentages();

        

    };
var additem = function(){  
//1.)get input data
var input=UIctrl.getinput();
console.log(input);
//2.)add item to budject controller
//if statement prevent addition of nan when no value is added.
if (input.description !== "" && !isNaN(input.value) && input.value > 0){
var newitem =budjectcontroller.additem(input.type,input.description,input.value);
//3.)add new item to user interface.
UIctrl.addListItem(newitem, input.type);
//clear the input field.
UIctrl.clearFields();
//5.)display the budject.
updateBudget();
// 6. Calculate and update percentages
updatePercentages();
}
console.log('it works');
 };
//this is used to determine the target element for each case. 
var ctrlDeleteItem = function(event) {
var itemid , splitID,type, ID;
//this returns the target element ever time we click an element within the container. 
//since we are interested in deleting the div of a unique ID of its parent element we traverse or move up the dom
//parent node is used to move up the dom to access the parent element of the target element.
//since the delete button is 4 element 
itemid = event.target.parentNode.parentNode.parentNode.parentNode.id ;  
console.log(itemid);
//inc-1
if (itemid){
//split is used to split the itemid string when - is present
splitID = itemid.split('-');
//this refers to the desctiption of the itemid
type = splitID[0];
//this refers to the idnumber of the specific id.
//parseint changes the int from string to integer
ID =parseInt(splitID[1]);
// 1. delete the item from the data structure
budjectCTRL.deleteItem(type,ID);
// 2. Delete the item from the UI
UIcontroller.deleteListItem(itemid);
// 3. Update and show the new budget
updateBudget();
// 4. Calculate and update percentages
}
}
    return{
        init: function(){
            console.log('application has started');
            UIctrl.displayMonth();
            UIctrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupeventlisteners();
        }
    }
    
 })(budjectcontroller, UIcontroller);
 controller.init();