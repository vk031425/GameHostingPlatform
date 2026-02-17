import "./PurchaseGameCard.css"
const PurchaseGameCard = (props)=>{
    return(
        <div className="purchasegame-card-container">
            <h1>
                {"$"} {props.price}
            </h1>
            <button className="buynow-button">
                Buy Now
            </button>
            <button className="add-wishlist-button">
                Add to Wishlist
            </button>
        </div>
    )
}

export default PurchaseGameCard;