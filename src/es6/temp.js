const myPromise = Promise.resolve("Promise!");

function funcOne() {
	myPromise.then(res => res).then(res => console.log(res));
}

async function funcTwo() {
	const res = await myPromise;
	console.log(await res);
	console.log("Last line!");
}

funcOne();
funcTwo();