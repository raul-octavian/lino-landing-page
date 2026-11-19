const T = 12;
let booked = 8;
const tubes = [...document.querySelectorAll("[data-tube]")],
lefts = [...document.querySelectorAll("[data-left]")];
function paint() {
const l = T - booked;
tubes.forEach((t) => {
t.innerHTML = Array.from(
{ length: T },
(_, i) =>
`<i class="seat ${i >= booked ? "seat--empty" : ""}"></i>`,
).join("");
});
lefts.forEach(
(s) =>
(s.textContent =
l > 0
? `${l} of ${T} seats left`
: "Fully booked. Join the waitlist."),
);
document.getElementById("submitButton").textContent =
l > 0 ? "Hold my seat" : "Join the waitlist";
document.getElementById("seatNumber").textContent = String(
Math.min(booked + 1, T),
).padStart(2, "0");
const q = document.getElementById("seatsSelect");
q.innerHTML =
l >= 2
? "<option>1</option><option>2</option>"
: "<option>1</option>";
}
paint();
const headline = document.getElementById("headline");
requestAnimationFrame(() =>
setTimeout(() => headline.classList.add("is-revealed"), 250),
);
document
.getElementById("bookingForm")
.addEventListener("submit", (e) => {
e.preventDefault();
const n = document.getElementById("nameInput").value.trim(),
m = document.getElementById("emailInput").value.trim(),
err = document.getElementById("formError");
if (!n) {
err.textContent =
"Add your name so we can put it on the seat.";
return;
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m)) {
err.textContent = "That email doesn’t look right yet.";
return;
}
err.textContent = "";
const l = T - booked,
q = Math.min(
+document.getElementById("seatsSelect").value,
Math.max(l, 1),
),
wait = l <= 0;
if (!wait) booked += q;
const no = String(Math.min(booked, T)).padStart(2, "0");
document
.getElementById("ticketStub")
.classList.add("is-torn");
setTimeout(() => {
document.getElementById("successTitle").textContent =
wait
? "You’re on the list."
: `Seat ${no} is yours, ${n.split(" ")[0]}.`;
document.getElementById("successText").textContent =
wait
? `We’ll email ${m} the moment a seat opens.`
: `A confirmation is on its way to ${m}. Bring an apron and an idea.`;
document
.getElementById("ticketCard")
.classList.add("is-submitted");
paint();
}, 650);
});
const bar = document.getElementById("bottomBar"),
hb = document.getElementById("ctaButton");
new IntersectionObserver(([x]) =>
bar.classList.toggle(
"is-visible",
!x.isIntersecting && x.boundingClientRect.top < 0,
),
).observe(hb);
