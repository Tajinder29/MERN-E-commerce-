import React, { useState } from 'react'
import "./AddProduct.css";
const AddProduct = () => {
    const [image,setimage]=useState(false);
    const [productDetails,setProductDetails]=useState({name:"",image:"",category:"women",new_price:"",old_price:""})
    const imagehandler=(e)=>{
      setimage(e.target.files[0]);
    }
    const changeHandler=(e)=>{
        setProductDetails({...productDetails,[e.target.name]:e.target.value})
    }
    const Add_Product=async()=>{
        console.log(productDetails);
        let responseData;
        let product=productDetails;
        let formData=new FormData();
        formData.append("image",image);

        await fetch("http://127.0.0.1:4000/upload",{
            method:'POST',
            headers:{
                Accept:'application/json',
            },
            body:formData,
        }).then((res)=>res.json()).then((data)=>{responseData=data})

        if(responseData.success){
            product.image=responseData.image_url;
            console.log(product);
            await fetch("http://localhost:4000/addproduct",{
                method:"POST",
                headers:{
                    Accept:'application/json',
                    'content-type':'application/json',
                },
                body:JSON.stringify(product),
            }).then((res)=>res.json()).then((data)=>{
                data.success?alert("product added"):alert("failed")
            })
        }
    }

  return (
    <div className='add-product'>
        <div className='addproduct-itemfield'>
            <h2>Product Title</h2>
            <input value={productDetails.name} onChange={changeHandler} type="text" name="name" placeholder='Type here' />
        </div>
        <div className='addproduct-price'>
            <div className='addproduct-itemfield'>
                <h2>Price</h2>
                <input type="text" value={productDetails.old_price} onChange={changeHandler} name="old_price" placeholder='Type here' />
            </div>
            <div className='addproduct-itemfield'>
                <h2>Offer Price</h2>
                <input type="text" value={productDetails.new_price} onChange={changeHandler} name="new_price" placeholder='Type here'/>
            </div>
        </div>
        <div className="addproduct-itemfield">
            <p>Product Category</p>
            <select name="category" value={productDetails.category} onChange={changeHandler} className='add-product-selector'>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kid">kid</option>
            </select>
        </div>
        <div className="addproduct-itemfield">
            <label htmlFor="file-input">
                <img  src={image?URL.createObjectURL(image):"/upload_area.svg"} alt="" className='addproduct-thumnail-img' />
            </label>
            <input onChange={imagehandler} type="file" name="image" id="file-input" hidden/>
        </div>
        <button onClick={Add_Product} className='addproduct-btn'>ADD</button>
    </div>
  )
}

export default AddProduct