
document.addEventListener("DOMContentLoaded", function(){
    var cloned_nodes=[];
    const dropdown = document.querySelectorAll(".search-products");
    dropdown.forEach(node =>{

            fetch(`api/v1/products/`)
            .then(response => response.json())
            .then(products => {
                products.forEach(product => {
                    const prod = document.createElement('option');
                    prod.value = product.product_name;
                    prod.dataset.code = product.product_code;
                    prod.dataset.price = product.unit_price;
                    
                    node.nextElementSibling.append(prod);
                })
            });
    });

    document.querySelector("#more-product").onclick = () => {
        node = document.querySelector('.select-product');
        cloned_node = node.cloneNode(true);
        cloned_nodes.push(cloned_node);
        document.querySelector('#all-products').appendChild(cloned_node);
    };
    document.querySelector("#less-product").onclick = () => {
        node_to_remove = cloned_nodes.pop();
        node_to_remove.remove();
    };

    document.querySelector("#order-form").onsubmit = () => {

        var form_data = {};
        event.target.childNodes.forEach(node => {
            if(node.name){
                form_data[node.name] = node.value;
            }
        });
        form_data["product_detail"] = [];
        try{

            document.querySelectorAll('.select-product').forEach(node => {

                let code=-1;
                // finding the product the user has selected
                document.querySelectorAll('option').forEach(opt => {
                    if(opt.value===node.querySelector('input').value){
                        code = opt.dataset.code;
                        price = opt.dataset.price;
                    }
                });
                
                const product_detail = {
                    'product_name':node.querySelector('input').value,
                    'product_code':code,
                    'unit_price':price,
                    'quantity':node.querySelector('.quantity').value
                    }
                form_data["product_detail"].push(product_detail);
    
                
            });
            
            fetch('api/v1/orderconfirmation/', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(form_data)
                })
                .then(response => {
                    if (response.status===201){
                        response.json().then(result =>{
                            window.location.href = `invoice/${result['filename']}`;
                        });
                    } else if (response.status===406){
                        response.json().then(result =>{
                            // console.log(result['error']);
                            document.querySelector('#error').innerHTML = result['error'];
                            document.querySelector('#error').style.display = 'block';
                        });
                    }
                });
        } catch(err) {
            document.querySelector('#error').innerHTML = "Product not found";
            document.querySelector('#error').style.display = 'block';
            }
            
        return false;
    };
    
});