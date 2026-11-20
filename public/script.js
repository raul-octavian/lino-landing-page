const TOTAL_SEATS = 12;
let bookedCount = 8;

const seatIndicatorTubes = [...document.querySelectorAll("[data-tube]")];
const seatLeftElements = [...document.querySelectorAll("[data-left]")];

function updateSeatDisplay() {
	const seatsLeft = TOTAL_SEATS - bookedCount;

	seatIndicatorTubes.forEach((tube) => {
		tube.innerHTML = Array.from(
			{ length: TOTAL_SEATS },
			(_, i) =>
				`<i class="seat ${i >= bookedCount ? "seat--empty" : ""}"></i>`,
		).join("");
	});

	seatLeftElements.forEach((el) => {
		el.textContent =
			seatsLeft > 0
				? `${seatsLeft} of ${TOTAL_SEATS} seats left`
				: "Fully booked. Join the waitlist.";
	});

	document.getElementById("submitButton").textContent =
		seatsLeft > 0 ? "Hold my seat" : "Join the waitlist";

	document.getElementById("seatNumber").textContent = String(
		Math.min(bookedCount + 1, TOTAL_SEATS),
	).padStart(2, "0");

	const seatsSelect = document.getElementById("seatsSelect");
	seatsSelect.innerHTML =
		seatsLeft >= 2
			? "<option>1</option><option>2</option>"
			: "<option>1</option>";
}

updateSeatDisplay();

const headlineElement = document.getElementById("headline");
requestAnimationFrame(() =>
	setTimeout(() => headlineElement.classList.add("is-revealed"), 250),
);

const bookingFormElement = document.getElementById("bookingForm");
bookingFormElement.addEventListener("submit", (event) => {
	event.preventDefault();

	const userName = document.getElementById("nameInput").value.trim();
	const userEmail = document.getElementById("emailInput").value.trim();
	const errorElement = document.getElementById("formError");

	if (!userName) {
		errorElement.textContent =
			"Add your name so we can put it on the seat.";
		return;
	}

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(userEmail)) {
		errorElement.textContent = "That email doesn’t look right yet.";
		return;
	}

	errorElement.textContent = "";

	const seatsLeft = TOTAL_SEATS - bookedCount;
	const requestedSeats = Math.min(
		+document.getElementById("seatsSelect").value,
		Math.max(seatsLeft, 1),
	);
	const isWaitlist = seatsLeft <= 0;

	if (!isWaitlist) {
		bookedCount += requestedSeats;
	}

	const assignedSeat = String(Math.min(bookedCount, TOTAL_SEATS)).padStart(
		2,
		"0",
	);

	document.getElementById("ticketStub").classList.add("is-torn");

	setTimeout(() => {
		document.getElementById("successTitle").textContent = isWaitlist
			? "You’re on the list."
			: `Seat ${assignedSeat} is yours, ${userName.split(" ")[0]}.`;
		document.getElementById("successText").textContent = isWaitlist
			? `We’ll email ${userEmail} the moment a seat opens.`
			: `A confirmation is on its way to ${userEmail}. Bring an apron and an idea.`;
		document.getElementById("ticketCard").classList.add("is-submitted");
		updateSeatDisplay();
	}, 650);
});

const bottomBarElement = document.getElementById("bottomBar");
const ctaButtonElement = document.getElementById("ctaButton");

new IntersectionObserver(([entry]) =>
	bottomBarElement.classList.toggle(
		"is-visible",
		!entry.isIntersecting && entry.boundingClientRect.top < 0,
	),
).observe(ctaButtonElement);