/* eslint-disable no-console */
import React, { useEffect, useState } from "react";

const urlBase = "https://assets.breatheco.de/apis/fake/todos/user/profe";

const home = () => {
	const [tasks, setTasks] = useState([]);

	const [newTask, SetNewTask] = useState("");

	const getTask = () => {
		fetch(urlBase)
			.then(respuesta => respuesta.json())
			.then(data => setTasks(data));
	};

	const handleAddTask = event => {
		if (event.key == "Enter" && newTask.length > 4) {
			setTasks([...tasks, { label: newTask, done: false }]);
			SetNewTask("");
			fetch(urlBase, {
				method: "PUT",
				body: JSON.stringify([
					...tasks,
					{ label: newTask, done: false }
				]),
				headers: {
					"Content-Type": "application/json"
				}
			});
		}
	};

	const handleDeleteTask = indexTask => {
		let filteredTasks = tasks.filter(
			(currentTask, indexCurrentTask) => indexCurrentTask !== indexTask
		);
		setTasks(filteredTasks);
		fetch(urlBase, {
			method: "PUT",
			body: JSON.stringify(filteredTasks),
			headers: {
				"Content-Type": "application/json"
			}
		});
	};

	const handleDeleteAll = () => {
		fetch(urlBase, {
			method: "DELETE",
			body: JSON.stringify({ label: newTask, done: false }),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(function(response) {
			if (response.status == 200) {
				fetch(urlBase, {
					method: "POST",
					body: JSON.stringify([]),
					headers: {
						"Content-Type": "application/json"
					}
				}).then(function(response) {
					if (response.status == 200) {
						fetch(urlBase)
							.then(respuesta => respuesta.json())
							.then(data => setTasks(data));
					}
				});
			}
		});
	};
	useEffect(() => {
		getTask();
	}, []);

	return (
		<>
			<div>
				<h1 className="text-center m-2">todos</h1>
				<div className="container shadow  bg-body rounded">
					<div className="justify-content-center">
						<input
							className=" container-fluid texto1 p-1 pl-4 border-0 m-3"
							placeholder="What needs be to done"
							onChange={event => SetNewTask(event.target.value)}
							onKeyPress={event => handleAddTask(event)}
							value={newTask}
						/>

						<ul className="container-fluid">
							{tasks.length
								? tasks.map((task, index) => {
										return (
											<ul
												className="texto1 row border-bottom"
												key={index}>
												<div className="col-11">
													{task.label}
												</div>
												<div className="col-1">
													<button
														type="button"
														onClick={() =>
															handleDeleteTask(
																index
															)
														}>
														X
													</button>
												</div>
											</ul>
										);
								  })
								: null}
						</ul>
						{tasks.length > 0 ? (
							<footer className="texto2 p-2 ">
								{tasks.length} Item left
							</footer>
						) : (
							<footer className="texto2 p-2">
								You are free of tasks!!
							</footer>
						)}
					</div>
				</div>
				<div className="container">
					<div className="row">
						<div className="col text-center">
							<button
								type="button"
								onClick={() => handleDeleteAll()}
								className="btn btn-danger m-3 ">
								Clean All
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default home;
