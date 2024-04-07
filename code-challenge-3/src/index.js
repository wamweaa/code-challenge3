// Your code here
document.addEventListener('DOMContentLoaded', function initialize() {
    getMovies();
});

const baseUrl = 'http://localhost:3000/films'
const ticketsUrl = 'http://localhost:3000/tickets'



// renders film list
function showMovieTitles(movies) {
    const filmList = document.querySelector('#films');
    filmList.innerHTML = ''
    movies.forEach(movie => {
        const movieTitle = document.createElement('li')
        movieTitle.className = 'film item';
        if (movie.tickets_sold >= movie.capacity) {
            movieTitle.classList.add('sold-out');
        }
        movieTitle.textContent = movie.title
        //creates delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = movie.tickets_sold >= movie.capacity ? 'Sold Out' : 'Delete';
        deleteButton.addEventListener('click', () => {
        deleteFilm(movie.id);
        });
        movieTitle.appendChild(deleteButton);
        filmList.appendChild(movieTitle);
    });
}

//renders first film details
function showFirstMovie(movie) {
    document.getElementById('title').textContent = movie.title
    document.getElementById('runtime').textContent = movie.runtime + ' minutes'
    document.getElementById('film-info').textContent = movie.description
    document.getElementById('showtime').textContent = movie.showtime
    document.getElementById('ticket-num').textContent = (movie.capacity - movie.tickets_sold)
    const posterImage = document.getElementById('poster')
    posterImage.src = movie.poster
    posterImage.alt = movie.title
    document.getElementById("buy-ticket").addEventListener('click', ()=>{
        ++ movie.tickets_sold 
        updateTicketsCount(movie)
        postTicketPurchase(movie.id, 1)
    })
    if (movie.tickets_sold >= movie.capacity) {
        document.getElementById("buy-ticket").disabled = true
        document.getElementById("buy-ticket").textContent = 'Sold Out';
        
    }
}

//fetch movies and display the first movie's details
function getMovies() {
    fetch(baseUrl)
    .then(res => res.json())
    .then(movies => {
        if (movies.length > 0) {
            showFirstMovie(movies[0]);
            showMovieTitles(movies)
        }
    })
}

//update remaining films on click of the buy ticket button
function updateTicketsCount(films){
    fetch(`${baseUrl}/${films.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({tickets_sold: films.tickets_sold + 1})
    }).then(res=>res.json())
    .then(updateMovie=>{
        
        const remainingTickets = updateMovie.capacity - updateMovie.tickets_sold;
        document.getElementById('ticket-num').textContent = remainingTickets
        // check if the movie is now sold out
        if (remainingTickets === 0) {
            // disable the "Buy Ticket" button
            document.getElementById("buy-ticket").disabled = true;
            document.getElementById("buy-ticket").textContent = 'Sold Out';
        }
    });
}

//post the bought ticket to the tickets endpoint
function postTicketPurchase(filmId, numberOfTickets) {
    //create a ticketData object
    const ticketData = {
        film_id: filmId,
        number_of_tickets: numberOfTickets
    };
    fetch(ticketsUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticketData)
    })
    .then(response => response.json())
    
}


//delete a film from the server
function deleteFilm(film) {
    fetch(`${baseUrl}/${film}`, {
        method: 'DELETE',
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(res=>res.json())
    //reload page on successful delete 
    window.location.reload()
}