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
      instructions: `
        <p>
          <strong>Step 1:</strong> Boil pasta in salted water until al dente.<br/>
          <strong>Step 2:</strong> In a separate pan, sauté ground beef with onions and garlic.<br/>
          <strong>Step 3:</strong> Add tomato sauce and seasoning to the beef. Simmer.<br/>
          <strong>Step 4:</strong> Drain pasta and mix with sauce. Serve hot.
        </p>
      `,
      thumbnail:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcr3Pe4G-Sej1e9PX7-kzf-8v36iTRMtRDGQ&s',
      postedAt: '2025-01-15T12:34:56Z',
      postedBy: 'u1',
      ingredients: 'spaghetti, sauce, ground beef'
    },
    {
      id: 'r2',
      name: 'Cheese Pizza',
      instructions: `
        <ol>
          <li>Preheat oven to 220°C (425°F).</li>
          <li>Roll out pizza dough and spread tomato sauce on top.</li>
          <li>Sprinkle with grated cheese and add toppings if desired.</li>
          <li>Bake for 15-20 minutes until crust is golden and cheese is melted.</li>
        </ol>
      `,
      thumbnail:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz--n5MKeSKzEId0KUTHaaCjtRskzd5lB1Tt-358E6m5OBKuSSvkDQivdB3SjTNOKFCeE&usqp=CAU',
      postedAt: '2025-01-10T10:20:30Z',
      postedBy: 'u1',
      ingredients: 'flour, cheese, sauce'
    },
    {
      id: 'r3',
      name: 'Chicken Curry',
      instructions: `
        <p>
          <em>Marinate chicken with spices:</em><br/>
          - Curry powder, salt, pepper, and lemon juice. Let rest 30 mins.<br/><br/>
          <strong>Cook Steps:</strong><br/>
          1. Sauté onions and tomatoes in oil.<br/>
          2. Add marinated chicken, stirring until lightly browned.<br/>
          3. Pour in coconut milk or water, simmer until chicken is cooked through.
        </p>
      `,
      thumbnail:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj-q9TED5yQGFq9OKBLuHdJheXhardCXHCag&s',
      postedAt: '2025-02-01T09:00:00Z',
      postedBy: 'u1',
      ingredients: 'chicken, curry powder, onions, tomatoes'
    },
    {
      id: 'r4',
      name: 'Pancakes',
      instructions: `
        <p>
          <strong>Batter:</strong><br/>
          - Combine flour, milk, eggs, sugar, and a pinch of salt.<br/>
          - Whisk until smooth.<br/>
          <br/>
          <strong>Cooking:</strong><br/>
          - Heat a lightly oiled pan over medium heat.<br/>
          - Pour batter and cook until bubbles form on top, then flip.<br/>
          - Serve with syrup, fruit, or butter.
        </p>
      `,
      thumbnail:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAIZ65XhaFb1hzAaTLszlH4wXfrjPXEmi8mw&s',
      postedAt: '2025-01-22T08:45:00Z',
      postedBy: 'u1',
      ingredients: 'flour, milk, eggs, sugar'
    },
    {
      id: 'r5',
      name: 'Avocado Toast',
      instructions: `
        <ul>
          <li>Toast bread until golden.</li>
          <li>Mash avocado with salt, pepper, and a squeeze of lime.</li>
          <li>Spread avocado on toast. Add toppings like tomato or cheese if desired.</li>
        </ul>
      `,
      thumbnail:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc9AIvAc6dkD5GTVhVASi91F4Jc4n7AbOFhw&s',
      postedAt: '2025-03-05T11:15:00Z',
      postedBy: 'u1',
      ingredients: 'bread, avocado, salt, pepper'
    },
    {
      id: 'r6',
      name: 'Caesar Salad',
      instructions: `
        <p>
          <strong>Steps:</strong><br/>
          1. Wash and chop romaine lettuce.<br/>
          2. Toss lettuce with Caesar dressing, croutons, and parmesan cheese.<br/>
          3. Season with salt, pepper, and lemon juice. Serve cold.
        </p>
      `,
      thumbnail:
        'https://itsavegworldafterall.com/wp-content/uploads/2023/04/Avocado-Caesar-Salad-FI.jpg',
      postedAt: '2025-03-10T14:30:00Z',
      postedBy: 'u1',
      ingredients: 'romaine lettuce, croutons, parmesan, caesar dressing'
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
  