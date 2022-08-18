const books = [];
const RENDER_EVENT = 'render-booklist'
const SAVED_EVENT = 'saved-booklist';
const STORAGE_KEY = 'bookshelf-app';
const submitAct = document.getElementById('form');
const find = document.getElementById('pencarian');
const subctn = document.querySelector('.sub-container-utama');


 function saveData() {    
    if (checkStorage()) {       
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

window.addEventListener('load', function(){
    subctn.classList.add('subCtnUtm'); 
    if(checkStorage){
                
        if(localStorage.getItem(STORAGE_KEY) !== null){                    
         getBooks();        
         find.innerHTML = '';    
        }                              
    }else{
        alert('Browser Anda Tidak Mendukung');
    }
});

window.addEventListener('scroll',function(){
    const unread = this.document.getElementById('subUnread').querySelectorAll('div');
    const read = this.document.getElementById('subRead').querySelectorAll('div');

    let wScroll = this.scrollY;   

    const offsetAdd = document.querySelector('.tambahBuku');

    if(wScroll > offsetAdd.offsetTop-200){       
        setTimeout(function(){            
                for(i = 0; i<unread.length; i++){
                    unread[i].classList.add('muncul');                
                  }
        },100);

        setTimeout(function(){            
            for(i = 0; i<read.length; i++){
                read[i].classList.add('muncul');                
              }
    },100);

    }
});

function checkStorage(){
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }



 function getBooks(){
    const serializeBookData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializeBookData);

    if(data !== null){
        for(const book of data){
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
 }

function generateID() {
    return +new Date();
}

function generateBookObject(id, title, author, release, isRead ){
    return {
        id,
        title,
        author,
        release,
        isRead,

    }
}

function addBook(){
    const titleBook = document.getElementById('judul').value;
    const namaPenulis = document.getElementById('penulis').value;
    const tahunTerbit = document.getElementById('tahun').value;

    const generatedID = generateID();
    const bookObject = generateBookObject(generatedID, titleBook,namaPenulis, tahunTerbit, false);
    books.push(bookObject);
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

}


document.addEventListener('DOMContentLoaded', function () {
    const formSubmit = document.getElementById('form');
    formSubmit.addEventListener('submit', function (e){
       
        const unreadBooks = document.getElementById('subUnread') ;
    
        const readBooks = document.getElementById('subRead')
   
        const unDiv = unreadBooks.querySelectorAll('div');
         
        setTimeout(function(){
            for(i = 0; i<unDiv.length; i++){
                unDiv[i].classList.add('muncul');            
               }
        },100);

        const Div = readBooks.querySelectorAll('div');
        setTimeout(function(){
            for(i = 0; i<Div.length; i++){
                Div[i].classList.add('muncul');                
               }
        },100);
        e.preventDefault();
        const judul = document.getElementById('judul').value;
        const penulis = document.getElementById('penulis').value;
        const tahun = document.getElementById('tahun').value;
       
        if(judul === ''||penulis === ''||tahun ==''){
            alert('data tidak boleh kosong!');   
        }else{
            addBook();
           
        }
       
    });

});

function newBook(bookObject){
    
    const textTitle = document.createElement("h2");
    textTitle.innerHTML = bookObject.title;

    
    const textAuthor = document.createElement("p");
    textAuthor.innerHTML = bookObject.author;

    const textRelease = document.createElement("p");
    textRelease.innerHTML = bookObject.release;

    const textContainer = document.createElement("div");
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textRelease);

    const container = document.createElement("div");
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', 'books-${bookObject.id}');

    if(bookObject.isRead){
        const undoBtn = document.createElement('button');
        undoBtn.classList.add('undo-button');
        undoBtn.innerHTML = '<img src="img/undo.png" alt="">';
        undoBtn.addEventListener('click', function (){
            undoRead(bookObject.id);

        });

        const trash = document.createElement('button');
        trash.classList.add('trash-button');
        trash.innerHTML = '<img src="img/trash.png" alt="">';
        trash.addEventListener('click', function(){
           let confirmDelete = confirm('Anda Yakin Untuk Menghapus Buku Ini?');
           if (confirmDelete){
            removeBook(bookObject.id); 
           }
           
        });

        const edit = document.createElement('button');
        edit.classList.add('trash-button');
        edit.innerHTML = '<img src="img/edit.png" alt="">';
        edit.addEventListener('click', function(){
            editFunction(bookObject.id);

        });

        container.append(undoBtn, trash, edit);

    }else{
        const check = document.createElement('button');
        check.classList.add('check-button');
        check.innerHTML = '<img src="img/read.png" alt="">';

        check.addEventListener('click', function(){
            addBookToRead(bookObject.id);
        });

        trash = document.createElement('button');
        trash.classList.add('trash-button');
        trash.innerHTML = '<img src="img/trash.png" alt="">';

        trash.addEventListener('click', function(){
          
           let confirmDelete = confirm('Anda Yakin Untuk Menghapus Buku Ini?');
           if (confirmDelete){
            removeBook(bookObject.id); 
           }
        });

        const edit = document.createElement('button');
        edit.classList.add('trash-button');
        edit.innerHTML = '<img src="img/edit.png" alt="">';
        edit.addEventListener('click', function(){
            editFunction(bookObject.id);

        });

        container.append(check, trash, edit);
    }
    return container;
}

function editFunction(editBookId){

    const bookTarget = findBook(editBookId);
    
            if (bookTarget == null) return;

            let judulInput = prompt('Masukan Judul Buku Terbaru');
                      
            if(judulInput!==null){ 

                let authorInput = prompt('Masukan Nama Penulis');
                if(authorInput !== null){

                    let releaseInput = prompt('Masukan Tahun');
                    if(releaseInput !==null){
                        
                        bookTarget.title = judulInput;
                        bookTarget.author = authorInput;
                        bookTarget.release = releaseInput;
                    }

                }               
                

            }
           

            const find = document.getElementById('pencarian');
            find.innerHTML = '';   
            setTimeout(function(){
                const findDiv = find.querySelectorAll('div');
                    for(i = 0; i<findDiv.length; i++){
                        findDiv[i].classList.add('zoom');
                        
                      }
            },100);

            readStatus(true, find, bookTarget); 

            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
}


function addBookToRead (bookId){
    const bookTarget = findBook(bookId);
    
    if (bookTarget == null) return;

    bookTarget.isRead= true; 

    const find = document.getElementById('pencarian');
    find.innerHTML = '';   
    setTimeout(function(){
        const findDiv = find.querySelectorAll('div');
            for(i = 0; i<findDiv.length; i++){
                findDiv[i].classList.add('zoom');
              }
    },100);

    readStatus(true, find, bookTarget); 
       
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId){
    for (const bookItem of books){
        if(bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}

function removeBook(bookId){
    const bookTarget = findBookIndex(bookId);
    
    if(bookTarget=== -1)return;

    const find = document.getElementById('pencarian');
    find.innerHTML = '';   

    setTimeout(function(){
        const findDiv = find.querySelectorAll('div');
            for(i = 0; i<findDiv.length; i++){
                findDiv[i].classList.add('zoom');
              }
    },100);
   
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoRead(bookId){
    const bookTarget = findBook(bookId);
    
    if(bookTarget == null)return;

    bookTarget.isRead = false;

    const find = document.getElementById('pencarian');
    find.innerHTML = '';   

    setTimeout(function(){
        const findDiv = find.querySelectorAll('div');
            for(i = 0; i<findDiv.length; i++){
                findDiv[i].classList.add('zoom');               
              }
    },100);
 
    readStatus(false, find, bookTarget); 
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId){
    for (const index in books){
        if (books[index].id === bookId ){
            return index;
        }
    }

    return -1;
}


function readStatus (f,c,n){

    const textStatus = document.createElement("h3");
    textStatus.innerHTML = "Hasil Pencarian";
    

    const statButton = document.createElement('button');
    statButton.classList.add('stat-button');
    statButton.innerText = 'Tutup';
    statButton.addEventListener('click', function (){
        
        setTimeout(function(){
            const find = document.getElementById('pencarian');
            const findDiv = find.querySelectorAll('div');
                for(i = 0; i<findDiv.length; i++){
                    findDiv[i].classList.remove('zoom');                    
                  }
        },100);
        

    });

    const statusInner = document.createElement("div");
    statusInner.classList.add('status');
    statusInner.append(textStatus);
    
    const statusContainer = document.createElement("div");
    statusContainer.classList.add('item','holo');
    statusContainer.append(statusInner, statButton);


    find.append(statusContainer);
    
   
        const bookFind = newBook(n);
           find.style.padding = "5%";
           bookFind.classList.add('holo');
          const button = bookFind.querySelectorAll('button');
          for(i = 0; i<button.length; i++){
            button[i].classList.add('btn-holo');
          }
         
           find.append(bookFind);

    if(f!== true){
       
        const textStatus = document.createElement("h3");
        textStatus.innerHTML = "Status : Belum Dibaca";

        const statusInner = document.createElement("div");
        statusInner.classList.add('status');
        statusInner.append(textStatus);

        const statusContainer = document.createElement("div");
        statusContainer.classList.add('item', 'holo');
        statusContainer.append(statusInner);

        c.append(statusContainer);
       }else{
        const textStatus = document.createElement("h3");
        textStatus.innerHTML = "Status : Sudah Dibaca";

        const statusInner = document.createElement("div");
        statusInner.classList.add('status');
        statusInner.append(textStatus);

        const statusContainer = document.createElement("div");
        statusContainer.classList.add('item', 'holo');
        statusContainer.append(statusInner);

        c.append(statusContainer);

       }
       
   }
   

function search(){
    
    const cari = document.getElementById('Cari').value;
    const booksStorage = localStorage.getItem(STORAGE_KEY);
    const parsedBooks = JSON.parse(booksStorage);

    const find = document.getElementById('pencarian');
    find.innerHTML = '';
    let ketemu = false;
   
    for( i in parsedBooks){
        if(parsedBooks[i]["title"] === cari ){
            const finded = parsedBooks[i];            
           
           const x = parsedBooks[i]["isRead"];

            readStatus(x, find ,finded);
            ketemu = true;            
        }

    }
    if(ketemu === false){
        alert('buku tidak ditemukan');
    }
    
}

const btnSearch = document.querySelector('.search');

btnSearch.addEventListener('click',function(){
    
    search();

    setTimeout(function(){
        const findDiv = find.querySelectorAll('div');
            for(i = 0; i<findDiv.length; i++){
                findDiv[i].classList.add('zoom');                
              }
    },100);
        
});


document.addEventListener(RENDER_EVENT, function(){
    
    const unreadBooks = document.getElementById('subUnread') ;
    unreadBooks.innerHTML = '';

    const readBooks = document.getElementById('subRead')
    readBooks.innerHTML = '';

    const find = document.getElementById('pencarian');
                   
   
    unreadBooks.onclick = function(){
        find.innerHTML = '';
        const unDiv = unreadBooks.querySelectorAll('div');
        setTimeout(function(){
            for(i = 0; i<unDiv.length; i++){
                unDiv[i].classList.add('muncul');                
               }
     
        },100);

        const Div = readBooks.querySelectorAll('div');
        setTimeout(function(){
            for(i = 0; i<Div.length; i++){
                Div[i].classList.add('muncul');                
               }
     
        },100);
               
    }

    readBooks.onclick = function(){
        find.innerHTML = '';

        const unDiv = unreadBooks.querySelectorAll('div');
        setTimeout(function(){
            for(i = 0; i<unDiv.length; i++){
                unDiv[i].classList.add('muncul');                
               }
     

        },100);

        const Div = readBooks.querySelectorAll('div');
        setTimeout(function(){
            for(i = 0; i<Div.length; i++){
                Div[i].classList.add('muncul');                 
               }    

        },100);
               
    }
                          
    for (const bookItem of books){
        const bookElement = newBook(bookItem);
        if (!bookItem.isRead){
            unreadBooks.append(bookElement);
            if(find.innerHTML === null){
                readStatus(false, find, bookItem);

               
            } 

        }else{
            readBooks.append(bookElement);
            if(find.innerHTML === null){
                readStatus(false, find, bookItem);
                 
            }
           
        }
        
    }
 });



 

 






