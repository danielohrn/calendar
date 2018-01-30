// Calendar
const CalendarModule = (function(){
    // DOM elements 
    const calendar = document.querySelector('#calendar'); 
    
    let selectedDate = null; 
    
    // DOM events 
    calendar.addEventListener('click', handleCalendarClick); 

    // Functions 
    function handleCalendarClick(e){
        const target = e.target; 
        if(target.classList.contains('item')) {
            const targetDate = target.querySelector('.date').innerHTML; 
            
            toggleSelectedView(target, selectedDate); 

            selectedDate = targetDate; 
                
            if(targetDate in localStorage) 
                DateDetailsModule.renderDateDetails(localStorage.getItem(targetDate)); 
            else 
                DateDetailsModule.renderDateDetails('[{"dateEmpty": "Inga tider inlagda."}]'); 
        } 
    }

    function toggleSelectedView(target, prevSelectedDate){
        target.classList.add('selected');
        if(prevSelectedDate) 
            calendar.querySelectorAll('.item')[prevSelectedDate-1].classList.remove('selected');
    }

    function getSelectedDate(){
        return selectedDate; 
    }
    
    // Exposed to other modules 
    return {
        getSelectedDate, 
    }

})(); 

// Add date
const AddDateModule = (function(){
    
    // DOM elements
    const addDate = document.querySelector('#addDate');
    const startTime = addDate.querySelector('#start');
    const endTime = addDate.querySelector('#end'); 

    // Dom events 
    addDate.querySelector('form').addEventListener('submit', handleAddDate); 

    // Functions 
    function addDateToStorage(dateToAdd){
        if(dateToAdd.date in localStorage) {
            const datesArray = JSON.parse(localStorage.getItem(dateToAdd.date));
            datesArray.push(dateToAdd);
            localStorage.setItem(dateToAdd.date, JSON.stringify(datesArray)); 
        } else {
            localStorage.setItem(dateToAdd.date, JSON.stringify([dateToAdd])); 
        }
    }

    function handleAddDate(e){
        e.preventDefault(); 
        
        const dateToAdd = { 
            date: CalendarModule.getSelectedDate(),
            start: startTime.value,
            end: endTime.value,
            available: true,
            id: Date.now()
        }

        if(CalendarModule.getSelectedDate()) {
            addDateToStorage(dateToAdd); 
            DateDetailsModule.renderDateDetails(localStorage.getItem(dateToAdd.date));
        }
    }

})(); 

// Date details 
const DateDetailsModule = (function(){

    // Dom elements 
    const dateDetails = document.querySelector('#dateDetails'); 

    // Functions 
    function renderDateDetails(dates){
        const datesArray = JSON.parse(dates); 
        dateDetails.innerHTML = ""; 
        datesArray.forEach(date => {
            dateDetails.innerHTML += dateDetailsHTML(date); 
        })
    }

    function dateDetailsHTML(date){
        if(date.dateEmpty) {
            return `<div class="date-container"><p>${date.dateEmpty}</p></div>`
        }
        const background = date.available ? '#4caf50' : '#c30130';
        return `
            <div data-id="${date.id}" style="background: ${background}; color: white;" class="date-container">
                <p>Börjar: ${date.start}</p>
                <p>Slutar: ${date.end}</p>
                <p>Status: ${date.available ? 'Tillgänglig' : 'Bokad'}</p>
            </div>
        `
    }

    // Exposed to other modules 
    return {
        renderDateDetails
    }

})(); 