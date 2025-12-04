from flask import Flask, render_template , url_for , request, redirect, session , flash
import json
from werkzeug.security import generate_password_hash, check_password_hash 
from math import ceil
app = Flask(__name__)

app.debug = True
app.jinja_env.auto_reload = True
app.config['TEMPLATES_AUTO_RELOAD'] = True

ITEMS_PER_PAGE = 12

app.secret_key = 'default_key'


def get_products():
    try:
        with open('file.json', 'r') as f:
            products = json.load(f)
        return products
    except FileNotFoundError:
        return []
    
# @app.route('/main')
@app.route('/')
def main():
    all_products = get_products()
    featured_products = all_products[:4]
    return render_template('main.html', featured_products=featured_products)
@app.route('/index')
@app.route('/products/<int:page>')
def index(page=1):
    all_products = get_products()
    total_pages = ceil(len(all_products) / ITEMS_PER_PAGE)
    start_index = (page - 1) * ITEMS_PER_PAGE
    end_index = start_index + ITEMS_PER_PAGE
    products = all_products[start_index:end_index]
    return render_template('index.html', products= products, total_pages=total_pages, current_page=page)


@app.route('/product/<int:product_id>')
def product(product_id):
    products = get_products()
    product_data = next((p for p in products if p['id'] == product_id), None)
    if not product_data:
        flash('Product not found.', 'error')
        return redirect(url_for('index'))
    related_products = [p for p in products if p['id'] != product_id][:4]
    return render_template('product.html', product=product_data, related_products=related_products)

def get_users():
    try :
        with open ('users.json','r') as f :
            users = json.load(f)
            return users
    except FileNotFoundError:
        return []
def save_users(users):
        with open ('users.json' ,'w') as f : 
            json.dump (users, f , indent=4)
    
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        submitted_email = request.form.get('email').strip()
        existing_users = get_users()
        email_exists = any(user.get('email') == submitted_email for user in existing_users)
        if email_exists:
            flash('Email already registered. Please use a different email.', 'error')
            return render_template('register.html',form_data=request.form)
        else:
            hashed_password = generate_password_hash(request.form.get('password'))
            new_user = {
                'username': request.form.get('username').strip(),
                'email': submitted_email,
                'password': hashed_password ,
                'role': 'user'
            }
            existing_users.append(new_user)
            save_users(existing_users)
            flash('Registration successful! Please log in.', 'success')
            return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        submitted_email = request.form.get('email', '').strip()
        submitted_password = request.form.get('password', '')
        
        existing_users = get_users()
        user = next((user for user in existing_users if user.get('email') == submitted_email), None)
        
        if user and check_password_hash(user.get('password'), submitted_password):
            session['user'] = {
                'username': user.get('username'),
                'email': user.get('email'),
                'role': user.get('role')
            }
            flash('Login successful!', 'success')
            if user.get('role').lower() == 'admin':
                return redirect(url_for('dashboard'))
            else:
                return redirect(url_for('index'))
        else:
            flash('Invalid email or password. Please try again.', 'error')
            return render_template('login.html')
    return render_template('login.html')
@app.route('/logout')
def logout():
    session.pop('user', None)
    flash('You have been logged out.', 'success')
    return redirect(url_for('main'))
@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')
@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')
        
        print(f"--- New Message ---\nFrom: {name} ({email})\nSubject: {subject}\nMessage: {message}\n-------------------")
        
        flash("Thank you! Your message has been sent successfully. We will reply shortly.", 'success')
        
        return redirect(url_for('contact'))

    return render_template('contact.html')

if __name__ == '__main__':
    app.run(debug=True)