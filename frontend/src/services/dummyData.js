// dummyData.js

const dummyUsers = [
    {
      id: 'u1',
      email: 'john@example.com',
      password: '123',
      favorites: ['r2']
    }
  ];
  
  const dummyRecipes = [
    {
      id: 'r1',
      name: 'Spaghetti Bolognese',
      instructions: '<p>Boil pasta. Add sauce...</p>',
      thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcr3Pe4G-Sej1e9PX7-kzf-8v36iTRMtRDGQ&s',
      postedAt: '2025-01-15T12:34:56Z',
      postedBy: 'u1',
      ingredients: 'spaghetti, sauce, ground beef'
    },
    {
      id: 'r2',
      name: 'Cheese Pizza',
      instructions: '<p>Bake it with cheese...</p>',
      thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz--n5MKeSKzEId0KUTHaaCjtRskzd5lB1Tt-358E6m5OBKuSSvkDQivdB3SjTNOKFCeE&usqp=CAU',
      postedAt: '2025-01-10T10:20:30Z',
      postedBy: 'u1',
      ingredients: 'flour, cheese, sauce'
    }
  ];
  
  /** LOGIN */
  export function dummyLogin(email, password) {
    const user = dummyUsers.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    return { userId: user.id, token: 'fake-jwt-token' };
  }
  
  /** REGISTER */
  export function dummyRegister(email, password) {
    const existingUser = dummyUsers.find((u) => u.email === email);
    if (existingUser) throw new Error('User already exists');
    const newUser = {
      id: 'u' + Date.now(),
      email,
      password,
      favorites: []
    };
    dummyUsers.push(newUser);
    return newUser;
  }
  
  /** GET or SEARCH recipes */
  export function dummyGetRecipes(searchQuery = '') {
    if (!searchQuery) return dummyRecipes;
    return dummyRecipes.filter((r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  /** CREATE new recipe */
  export function dummyCreateRecipe({ name, instructions, thumbnail, ingredients, userId }) {
    const newRecipe = {
      id: 'r' + Date.now(),
      name,
      instructions,
      thumbnail,
      postedAt: new Date().toISOString(),
      postedBy: userId,
      ingredients
    };
    dummyRecipes.push(newRecipe);
    return newRecipe;
  }
  
  /** FAVORITES */
  export function dummyGetFavorites(userId) {
    const user = dummyUsers.find((u) => u.id === userId);
    if (!user) return [];
    return dummyRecipes.filter((r) => user.favorites.includes(r.id));
  }
  
  export function dummyAddToFavorites(userId, recipeId) {
    const user = dummyUsers.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    if (!user.favorites.includes(recipeId)) {
      user.favorites.push(recipeId);
    }
  }
  
  export function dummyRemoveFromFavorites(userId, recipeId) {
    const user = dummyUsers.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    user.favorites = user.favorites.filter((id) => id !== recipeId);
  }
  
  /** DELETE (owner only) */
  export function dummyDeleteRecipe(userId, recipeId) {
    const index = dummyRecipes.findIndex(
      (r) => r.id === recipeId && r.postedBy === userId
    );
    if (index === -1) throw new Error('Not authorized or recipe not found');
    dummyRecipes.splice(index, 1);
  }
  