const playBtn = document.getElementById("playBtn");
const playPrompt = document.getElementById("playPrompt");
const navButtons = document.querySelectorAll("#nav-scroll");
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = "black";
c.fillRect(0, 0, canvas.width, canvas.height);

playBtn.addEventListener('click', () => {
    playPrompt.style.display = 'none';
    canvas.style.display = 'block';
})


const scrollToElem = (element) => {
    element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
}

navButtons.forEach(button => {
    const name = button.getAttribute("name");
    const scrollTo = document.getElementById(name);
    button.addEventListener('click', () => scrollToElem(scrollTo))
});