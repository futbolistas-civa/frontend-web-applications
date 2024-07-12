import logo from './logo.svg';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './App.css';

interface Position {
  id: number;
  type: string;
}

interface SoccerPlayer {
  soccerPlayerId: number;
  name: string;
  lastName: string;
  birthdate: string;
  features: string;
  position: Position;
}

const App: React.FC = () => {
  const [soccerPlayers, setSoccerPlayers] = useState<SoccerPlayer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newPlayer, setNewPlayer] = useState<SoccerPlayer>({
    soccerPlayerId: 0,
    name: '',
    lastName: '',
    birthdate: '',
    features: '',
    position: { id: 0, type: '' }
  });

  const API_URL = 'http://localhost:8080/api/v1';

  useEffect(() => {
    const fetchSoccerPlayers = async () => {
      try {
        const response = await fetch(`${API_URL}/futbolista`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSoccerPlayers(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchSoccerPlayers();
  }, []);

  const fetchSoccerPlayerById = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/futbolista/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      alert(JSON.stringify(data, null, 2));
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'position.id') {
      const selectedPosition = getPositionById(Number(value));
      setNewPlayer((prevPlayer) => ({
        ...prevPlayer,
        position: {
          id: selectedPosition.id,
          type: selectedPosition.type
        }
      }));
    } else {
      setNewPlayer((prevPlayer) => ({
        ...prevPlayer,
        [name]: value
      }));
    }
  };

  const getPositionById = (id: number): Position => {
    const positions = [
      { id: 1, type: 'ARQUERO' },
      { id: 2, type: 'DEFENSA' },
      { id: 3, type: 'MEDIOCAMPISTA' },
      { id: 4, type: 'DELANTERO' }
    ];
    return positions.find((position) => position.id === id) || { id: 0, type: '' };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const playerToSubmit = {
        ...newPlayer,
        position: {
          id: newPlayer.position.id,
          type: getPositionById(newPlayer.position.id).type
        }
      };

      const response = await fetch(`${API_URL}/futbolista`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerToSubmit),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSoccerPlayers((prevPlayers) => [...prevPlayers, data]);
      setNewPlayer({
        soccerPlayerId: 0,
        name: '',
        lastName: '',
        birthdate: '',
        features: '',
        position: { id: 0, type: '' },
      });
    } catch (error: any) {
      alert('Error saving soccer player: ' + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/futbolista/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setSoccerPlayers((prevPlayers) => prevPlayers.filter((player) => player.soccerPlayerId !== id));
    } catch (error: any) {
      alert('Error deleting soccer player: ' + error.message);
    }
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-5">
    <div className="card mb-4">
      <div className="card-header">
        <h1>Soccer Players</h1>
      </div>
      <div className="card-body">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Last Name</th>
              <th>Birthdate</th>
              <th>Features</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {soccerPlayers.map((player) => (
              <tr key={player.soccerPlayerId}>
                <td>{player.soccerPlayerId}</td>
                <td>{player.name}</td>
                <td>{player.lastName}</td>
                <td>{player.birthdate}</td>
                <td>{player.features}</td>
                <td>{player.position.type}</td>
                <td>
                  <button className="btn btn-danger me-2" onClick={() => handleDelete(player.soccerPlayerId)}>Delete</button>
                  <button className="btn btn-info" onClick={() => fetchSoccerPlayerById(player.soccerPlayerId)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="card">
      <div className="card-header">
        <h2>Add New Player</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Name"
              value={newPlayer.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="lastName"
              placeholder="Last Name"
              value={newPlayer.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="date"
              className="form-control"
              name="birthdate"
              placeholder="Birthdate"
              value={newPlayer.birthdate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="features"
              placeholder="Features"
              value={newPlayer.features}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <select className="form-control" name="position.id" value={newPlayer.position.id} onChange={handleChange} required>
              <option value="0">Select Position</option>
              <option value="1">ARQUERO</option>
              <option value="2">DEFENSA</option>
              <option value="3">MEDIOCAMPISTA</option>
              <option value="4">DELANTERO</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success">Add</button>
        </form>
      </div>
    </div>
  </div>
  );
}

export default App;
