Vue.component('product',{

	props:{ //to plug-in the value
		premium:{
			type: Boolean,
			required: true
		}
	},

	template: ` 
	<div class="product">
	<div class="product-image">
		<img v-bind:src="image" v-bind:alt='altText'>
		<!--  v-bind creates a bond bw the data nd the html attribute(src) that we want to be bound to -->
	</div>
	<div class="product-info">
		
	<h1>{{title}}</h1>
	<p>{{description}}</p>

	<a v-bind:href="link">Google</a>

	<p v-if="inStock">In Stock</p>
	<p v-else
	   :class="{ linethrough: !inStock}">Out of Stock</p>

	<!-- <p v-if="inventory > 10">In Stock</p>
	<p v-else-if='inventory>0 && inventory<=10'>Almost sold out</p>
	<p v-else>Out of stock</p>-->

	<!-- <p v-show="inStock">In</p> -->
	<!-- v-show-> a css element called display:none is added w/o removing the element (to toggle on & off frequently-->

	<!-- <span v-if="onSale">On Sale!!</span> -->

	<p >{{sale}}</p>
	<!--<p>User is premium: {{ premium }}</p>-->
	<p> Shipping: {{shipping}} </p>

	<product-details :details="details"></product-details>
    <!-- binds the details of the component with the details in the data-->
	
	<div class="color-box" 
		v-for="(variant,index) in variants" 
		:key="variant.variantId"
		:style="{backgroundColor: variant.variantColor}"
		@mouseover="updateProduct(index)">
	<!-- index will be either  1 or 0 -->
	</div>


	<h4>Sizes</h4>
	<ul>
		<li v-for="size in sizes">{{size}}</li>
	</ul>


	<product-review @review-submited="addReview"> </product-review>

	<div>

		

        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
          <li v-for="(review,index) in reviews" :key="index">
          <p>{{ review.name }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>{{ review.review }}</p>
          </li>
        </ul>
       </div>

	<button v-on:click="addToCart"
			:disabled="!inStock" 
			:class="{ disabledButton: !inStock}"> 
			Add to Cart</button>
	<!-- to diable the add button(disabled property of button),bind the class disabledbtn wic changes the color when it is outofstock -->

	<button @click='deleteFromCart'>Delete From Cart</button>

	




</div>

	</div>
</div>
`,

	data() {
		return {
		message: 'Socks',
		brand: 'Nassy',
		description: 'I love this product',
		// image: './vmSocks-green-onWhite.jpg',
		altText: 'A pair of sock',
		link: 'www.google.com',
		// inStock: true,
		inventory: 0,
		selectedVariant: 0,
		onSale: true,
		details: ['80% cotton','20% polyster','neutral'],

		variants: [
			{
				variantId: 1,
				variantColor: "green",
				variantImage: './vmSocks-green-onWhite.jpg',
				variantQuantity: 10
			},

			{
				variantId: 2,
				variantColor: "blue",	
				variantImage: './vmSocks-blue-onWhite.jpg',
				variantQuantity: 20
			}

		],

		sizes: ['S','M','L','XL'],
		reviews: [],


	}
},
			
			methods:{
				addToCart() {
					this.$emit('add-to-cart',
					this.variants[this.selectedVariant].variantId)
					//when add to cart button is clicked ,
					//it tells us to listen to an event called add-to-cart
					//we also pass wic prod was added to cart
				},
				deleteFromCart(){
					this.$emit('delete-from-cart',
					this.variants[this.selectedVariant].variantId)
					// this.cart -= 1
				},
				updateProduct(index){
					this.selectedVariant = index
					console.log(index)
				},
				addReview(productReview){
					this.reviews.push(productReview)
				}

		},
		computed:{
			title(){
				return this.brand + ' ' + this.message
			},
			image(){
				return this.variants[this.selectedVariant].variantImage
			},//variants is a list--> variants[0].img
			inStock(){
				return this.variants[this.selectedVariant].variantQuantity
			},//depending on varQuantity
			sale(){
				if(this.onSale){
				return this.brand+' '+this.message+' '+'are on Sale'
			}
				return this.brand+' '+this.message+' '+'are not on Sale'
		},
			shipping(){
				if(this.premium){
					return "Free"
				}
					return 100
			},
		}

})

Vue.component('product-details',{
	props:{
		details:{
			type: Array,
			required: true
		}
		},
	template: `
	<ul>
		<li v-for="detail in details">{{detail}}</li>
	</ul>
	
	`,

	
})

Vue.component('product-review',{
	template: `

	<div>
	<form class="review-form" @submit.prevent="onSubmit">
	<!-- .prevent-> event modifier, which is used to prevent the submit event from reloading our page
	v-on = @ -->

    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
   	 	</p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
        <!-- v-model  directive gives us this two-way binding -->
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
          <p>
          	<p> Would you recommend this product?</p>
          	<label> Yes
          	<input type="radio"  value="yes" v-model="recommend"> </label>
  			<label>No
  			<input type="radio"  value="no" v-model="recommend"> 
          	</label>
          </p>
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>

	</div>
	`,

	data() {
		return {
		name: null,
		review: null,
		rating: null,
		errors:[],
		recommend:null
		
		}
	},
	methods:{
		onSubmit(){
			if(this.name && this.review && this.rating && this.recommend) {
			let productReview ={
				name: this.name,
				review: this.review,
				rating: this.rating,
				recommend: this.recommend

			}
			//send the product-review to product component
			this.$emit('review-submited',productReview)
			this.name =null
			this.review=null
			this.rating=null
			this.recommend=null
		}
		else {
        if(!this.name) this.errors.push("Name required.")
        if(!this.review) this.errors.push("Review required.")
        if(!this.rating) this.errors.push("Rating required.")
        if(!this.recommend) this.errors.push("Recommendation required")
      }//custom form validation 
	}
	}
})


var app = new Vue({  //create a Vue instance called app
		el : '#myapp', //el-> element property called myapp wic connects to the div wid id myapp
 		data: {
 			premium: true,
 			// cart:0,
 			cart:[]//wic will contain the prod id in the cart
 		},
 		methods:{
 			updateCart(id){
 				// this.cart+=1
 				this.cart.push(id)
 			},
 			removeFromCart(id){
 				for(var i = this.cart.length - 1; i >= 0; i--) {
            	if (this.cart[i] === id) {
               this.cart.splice(i, 1);
            	}
            }
 			},
 		}
	})

