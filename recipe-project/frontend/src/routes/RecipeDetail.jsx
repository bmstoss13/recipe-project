import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import '../styles/UserRecipeDetail.css';
import ChatAssistant from '../components/ChatBot';
import Comments from '../components/Comments';
import Navbar from "../components/Navbar";

import { IoIosTimer } from "react-icons/io";
import { IoPersonSharp } from "react-icons/io5";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`http://localhost:5050/create/get/${id}`);
      const data = response.data;
      console.log(data);
      setRecipe(data);
    }

    if (id) {
      fetchData();
    }
  }, [id])
  if (recipe) {
    return (
      <div className="userRecipeContainer">
        <Navbar/>
        <div className="userRecipeMain">
          <div className="userRecipeHeaderContainer">
            <div className="userRecipeHeaderText">{recipe.title}</div>
            <div className="userRecipeUser">By {recipe.username}</div>
          </div>
          <div className="userRecipeIngredientsHeader">Description</div>
          <div className="userRecipeHeaderSubText">{recipe.description}</div>
          <div className="userRecipeNumbersContainer">
            <div className="userRecipeNumbersChild">
              <IoIosTimer className="userRecipeNumbersIcon" size={22}/>
              <div className="userRecipeNumbersText">{parseInt(recipe.prep_time) + parseInt(recipe.cook_time)} mins</div>
            </div>
            <div className="userRecipeNumbersChild">
              <IoPersonSharp className="userRecipeNumbersIcon" size={22}/>
              <div className="userRecipeNumbersText">{parseInt(recipe.servings)} servings</div>
            </div>
          </div> 
          <div className="userRecipeIngredientsContainer">
            <div className="userRecipeIngredientsHeader">Ingredients</div>
            {recipe.ingredients.map((ingredient, idx) => (
              <div key={idx} className="userRecipeIngredientsChild">
                • {ingredient}
              </div>
            ))}
          </div>
          <div className="userRecipeInstructionsContainer">
            <div className="userRecipeIngredientsHeader">Instructions</div>
            {recipe.instructions.map((instruction, idx) => (
              <div key={idx} className="userRecipeIngredientsChild">
                {idx + 1}. {instruction}
              </div>
            ))}
          </div>
          <Comments recipeId={id} />
          <div className="adminSpacing"></div>
        </div>
        <div className="chat-button" onClick={() => alert("AI Assistant coming soon!")}>
          💬 Need help?
        </div>
        <ChatAssistant />
      </div>
    );
  } else {
    return (
      <div className="userRecipeContainer">
        <Navbar/>
        <div className="userRecipeMain">
        </div>
      </div>
    )
  }
};

export default RecipeDetail;
