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
                DateDetailsModule.renderDateDetails('[{"dateEmpty": "Inga lediga tider."}]'); 
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

// Date details 
const DateDetailsModule = (function(){

    // Dom elements 
    const dateDetails = document.querySelector('#dateDetails'); 
    
    dateDetails.addEventListener('click', handleBooking); 

    // Functions 
    function renderDateDetails(dates){
        const datesArray = JSON.parse(dates); 
        dateDetails.innerHTML = ""; 

        // Returns available dates or empty dates 
        const datesToRender = datesArray.filter(date => {
            return date.available || date.dateEmpty; 
        })

        if(datesToRender.length > 0) {
            datesToRender.forEach(availDate => {
                dateDetails.innerHTML += dateDetailsHTML(availDate); 
            })
        } else { // If there are appointments on the selected date but none available 
            dateDetails.innerHTML += dateDetailsHTML({dateEmpty: 'Inga lediga tider.'}); 
        }
    }

    function handleBooking(e){
        e.preventDefault(); 
        if(e.target.classList.contains('handle-booking-btn') && e.target.nodeName == 'BUTTON') {
            const { id, date } = e.target.parentNode.dataset;
            const dateArray = JSON.parse(localStorage.getItem(date)); 
            
            const modifiedDatesArray = dateArray.map(d => {
                if(d.id == id) d.available = false; 
                return d; 
            })
            localStorage.setItem(date, JSON.stringify(modifiedDatesArray));
            // Prints message to user, dissapears when new date is selected 
            e.target.parentNode.innerHTML = 'Datum bokat.';  
        }
    }

    function dateDetailsHTML(date){
        // If date is empty return message markup
        if(date.dateEmpty) { return `<div class="date-container"><p>${date.dateEmpty}</p></div>` }
        
        // Else return the date markup 
        const background = date.available ? '#4caf50' : '#c30130';
        return `
            <div data-date="${date.date}" data-id="${date.id}" style="background: ${background}; color: white;" class="date-container">
                <p>Börjar: ${date.start}</p>
                <p>Slutar: ${date.end}</p>
                <p>Status: Ledig</p>
                <button class="handle-booking-btn">Boka tid</button>
            </div>
        `
    }

    // Exposed to other modules 
    return {
        renderDateDetails
    }

})(); 



