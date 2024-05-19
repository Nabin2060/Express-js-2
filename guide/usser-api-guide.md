#user signup




#login
 -input=>req.body=>email,password
    -if email and password doens't match =>throw error

 -output=>jwt token

 #user list API(admin)

 -if user is admin, show list of user
 -if user is not admin,throw unauthorized error

 -How ?? By using JWT Token; by sending jwt token through headers.