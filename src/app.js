import carrier from "../static/carrier.jpg";
import carseat from "../static/carseat.jpg";
import crib from "../static/crib.jpg";
import diapers from "../static/diapers.jpg";
import highchair from "../static/highchair.jpg";
import playpen from "../static/playpen.jpg";
import pump from "../static/pump.jpg";
import stroller from "../static/stroller.jpg";
import baby1 from "../static/1.jpg";
import baby2 from "../static/2.jpg";
import baby3 from "../static/3.jpg";
import baby4 from "../static/4.jpg";
import baby5 from "../static/5.jpg";
import baby6 from "../static/6.jpg";
import baby7 from "../static/7.jpg";
import baby8 from "../static/8.jpg";
import baby9 from "../static/9.jpg";
import baby10 from "../static/10.jpg";
import baby11 from "../static/11.jpg";
import baby12 from "../static/12.jpg";
import baby13 from "../static/13.jpg";
import baby14 from "../static/14.jpg";
import baby15 from "../static/15.jpg";
import baby16 from "../static/16.jpg";
import baby17 from "../static/17.jpg";
import baby18 from "../static/18.jpg";
import baby19 from "../static/19.jpg";
import baby20 from "../static/20.jpg";
import { HttpClient } from "aurelia-fetch-client";
import { inject } from "aurelia-framework";

@inject(HttpClient)
export class App {
	constructor(httpClient) {

		this.httpClient = httpClient;
		this.httpClient.configure(config => {
			config.withDefaults({
				headers: {
					"Content-Type": "application/json"
				}
			});
		});
		this.items = [
			{ 
				id: "carseat",
				img: carseat,
				name: "Peg Perego Primo Viaggio Infant Car Seat",
				price: ""
			}, {
				id: "diapers",
				img: diapers,
				name: "Pampers Swaddlers 96-pack (Size 6)",
				price: ""
			}, {
				id: "stroller",
				img: stroller,
				name: "Baby Jogger City Mini Double Stroller",
				price: ""
			}, {
				id: "carrier",
				img: carrier,
				name: "BabyBjörn Baby Carrier",
				price: ""
			}, {
				id: "playpen",
				img: playpen,
				name: "Baby Trend Lil Snooze Deluxe Nursery Centre",
				price: ""
			}, {
				id: "highchair",
				img: highchair,
				name: "Peg Perego - Prima Pappa Zero3 Highchair",
				price: ""
			}, {
				id: "crib",
				img: crib,
				name: "Oxford Baby Danbury 4-in-1 Convertible Crib",
				price: ""
			}, {
				id: "pump",
				img: pump,
				name: "Medela Pump Electric Breastpump",
				price: ""
			}
		];

		this.babies = [
			{
				id: 0,
				img: baby1,
				guess: ""
			},
			{
				id: 1,
				img: baby2,
				guess: ""
			},
			{
				id: 2,
				img: baby3,
				guess: ""
			},
			{
				id: 3,
				img: baby4,
				guess: ""
			},
			{
				id: 4,
				img: baby5,
				guess: ""
			},
			{
				id: 5,
				img: baby6,
				guess: ""
			},
			{
				id: 6,
				img: baby7,
				guess: ""
			},
			{
				id: 7,
				img: baby8,
				guess: ""
			},
			{
				id: 8,
				img: baby9,
				guess: ""
			},
			{
				id: 9,
				img: baby10,
				guess: ""
			},
			{
				id: 10,
				img: baby11,
				guess: ""
			},
			{
				id: 11,
				img: baby12,
				guess: ""
			},
			{
				id: 12,
				img: baby13,
				guess: ""
			},
			{
				id: 13,
				img: baby14,
				guess: ""
			},
			{
				id: 14,
				img: baby15,
				guess: ""
			},
			{
				id: 15,
				img: baby16,
				guess: ""
			},
			{
				id: 16,
				img: baby17,
				guess: ""
			},
			{
				id: 17,
				img: baby18,
				guess: ""
			},
			{
				id: 18,
				img: baby19,
				guess: ""
			},
			{
				id: 19,
				img: baby20,
				guess: ""
			}
		];
	}

	activate() {
		return this.httpClient.fetch("gameOver").then(response => {
			return response.json();
		})
		.then(response => {
			this.gameOver = response.gameOver;
			return this.httpClient.fetch(`api`)
		})
		.then(response => {
			return response.json();
		}).then(data => {
			this.players = [];
			this.itemRanks = [];
			this.babyRanks = [];
			this.items.forEach((item, i) => this.itemRanks[i] = []);
			this.babies.forEach((baby, i) => this.babyRanks[i] = []);
			console.log(data);
			let index = 0;
			for (var player in data) {
				if (data.hasOwnProperty(player)) {
					this.players[index] = {
						player: player,
						score: 0
					};
					data[player].items.forEach((item, i) => {
						this.itemRanks[i].push({
							player: player,
							index: index,
							difference: item.price - item.guess,
							guess: item.guess,
							price: item.price
						});
					});
					data[player].babies.forEach((baby, i) => {
						if (baby.correct) {
							this.players[index].score += 3;
						}
						this.babyRanks[i].push({
							baby: baby.baby,
							player: player,
							guess: baby.guess
						});
					})
					index++;
				}
			}
			this.itemRanks.forEach(itemRank => {
				itemRank.sort((player1, player2) => {
					return Math.abs(player1.difference) - Math.abs(player2.difference);
				})
			});
			this.itemRanks.forEach(itemRank => {
				for (var i = 0; i < 10; ++i) {
					try {
						this.players[itemRank[i].index].score += 10 - i;
					} catch (error) {}
				}
			});
			this.players.sort((player1, player2) => player2.score - player1.score);
		});
	}

	submit() {
		let invalidItems = [];
		let invalidBabies = [];
		this.items.forEach(item => {
			console.log(item.id + " " + item.price);
			if (!item.price) {
				invalidItems.push(item);
			} else {
				try {
					parseInt(item.price);
				} catch (error) {
					invalidItems.push(item);
				}
			}
		});
		this.babies.forEach(baby => {
			console.log(baby.id + " " + baby.guess);
			if (baby.guess === "") {
				invalidBabies.push(baby);
			}
		});

		if (invalidItems.length > 0) {
			alert(`Go an enter a valid integer for the following items: ${invalidItems.map(item => item.name)}`)
			return;
		} else if (invalidBabies.length > 0) {
			alert(`Go an enter a valid integer for the following babies: ${invalidBabies.map(baby => baby.id + 1)}`)
			return;
		}

		let guesses = this.items.map(item => {
			return {
				id: item.id,
				price: parseInt(item.price)
			};
		});
		var options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				name: this.name,
				items: guesses,
				babies: this.babies
			})
		};
		return this.httpClient.fetch(`api`, options)
			.then(response => {
				return response.json();
			}).then(data => {
				alert("Thanks for playing! Refresh this page once all players are done to see your results.")
				console.log(data);
			});
	}
}
