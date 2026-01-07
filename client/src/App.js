// Updated App.js with enhanced features

import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');

  // add new todo item to database
  const addItem = async (e) => {
    e.preventDefault();
    if (!itemText.trim()) return; // Prevent empty items

    try {
      const res = await axios.post('http://localhost:5500/api/item', {
        item: itemText,
      });
      setListItems((prev) => [...prev, res.data]);
      setItemText('');
    } catch (err) {
      console.log(err);
    }
  };

  //Create function to fetch all todo items from database -- we will use useEffect hook
  useEffect(() => {
    const getItemsList = async () => {
      try {
        const res = await axios.get('http://localhost:5500/api/items');
        setListItems(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getItemsList();
  }, []);

  // Delete item when click on delete
  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5500/api/item/${id}`);
      const newListItems = listItems.filter((item) => item._id !== id);
      setListItems(newListItems);
    } catch (err) {
      console.log(err);
    }
  };

  //Update item
  const updateItem = async (e) => {
    e.preventDefault();
    if (!updateItemText.trim()) {
      setIsUpdating('');
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5500/api/item/${isUpdating}`,
        { item: updateItemText }
      );

      const updatedItemIndex = listItems.findIndex(
        (item) => item._id === isUpdating
      );

      const updatedList = [...listItems];
      updatedList[updatedItemIndex].item = updateItemText;

      setListItems(updatedList);
      setUpdateItemText('');
      setIsUpdating('');
    } catch (err) {
      console.log(err);
    }
  };

  // Cancel update
  const cancelUpdate = () => {
    setIsUpdating('');
    setUpdateItemText('');
  };

  //before updating item we need to show input field where we will create our updated item
  const renderUpdateForm = () => (
    <form
      className="update-form"
      onSubmit={(e) => {
        updateItem(e);
      }}
    >
      <input
        className="update-new-input"
        type="text"
        placeholder="Update item..."
        onChange={(e) => {
          setUpdateItemText(e.target.value);
        }}
        value={updateItemText}
        autoFocus
      />
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="update-new-btn" type="submit">
          Update
        </button>
        <button
          className="delete-item"
          type="button"
          onClick={cancelUpdate}
          style={{
            padding: '16px 20px',
            background: 'linear-gradient(90deg, #6c757d, #868e96)',
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );

  // Render empty state
  const renderEmptyState = () => (
    <div className="empty-state">
      <h3>Your to-do list is empty</h3>
      <p>Add a new task above to get started</p>
    </div>
  );

  return (
    <div className="App">
      <h1>My Todo List</h1>

      {/* Stats Section */}
      <div className="todo-stats">
        <div className="stat">
          <div className="stat-value">{listItems.length}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat">
          <div className="stat-value">
            {listItems.filter((item) => !item.completed).length}
          </div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat">
          <div className="stat-value">
            {listItems.filter((item) => item.completed).length}
          </div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <form className="form" onSubmit={(e) => addItem(e)}>
        <input
          type="text"
          placeholder="What needs to be done?"
          onChange={(e) => {
            setItemText(e.target.value);
          }}
          value={itemText}
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="todo-listItems">
        {listItems.length === 0
          ? renderEmptyState()
          : listItems.map((item) => (
              <div className="todo-item" key={item._id}>
                {isUpdating === item._id ? (
                  renderUpdateForm()
                ) : (
                  <>
                    <p className="item-content">{item.item}</p>
                    <div className="todo-item-actions">
                      <button
                        className="update-item"
                        onClick={() => {
                          setIsUpdating(item._id);
                          setUpdateItemText(item.item);
                        }}
                      >
                        Update
                      </button>
                      <button
                        className="delete-item"
                        onClick={() => {
                          deleteItem(item._id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
      </div>

      <footer
        style={{
          marginTop: '40px',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.9rem',
          textAlign: 'center',
        }}
      >
        {listItems.length > 0
          ? `${listItems.length} task${
              listItems.length !== 1 ? 's' : ''
            } in your list`
          : 'Add your first task to get started'}
      </footer>
    </div>
  );
}

export default App;
