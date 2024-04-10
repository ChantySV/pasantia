document.addEventListener("DOMContentLoaded", function() {
    var modal = document.querySelector(".modal");
    var closeModal = document.querySelector(".close-modal");
  
   
    modal.style.display = "block";
  
    
    closeModal.addEventListener("click", function() {
      modal.style.display = "none";
    });
  });