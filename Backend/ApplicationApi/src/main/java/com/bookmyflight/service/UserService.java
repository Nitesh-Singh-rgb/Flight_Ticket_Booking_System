package com.bookmyflight.service;

import java.util.Collection;

import com.bookmyflight.bean.Login;
import com.bookmyflight.entity.User;
import com.bookmyflight.exception.UserException;

public interface UserService {
	
	 int createUser(User user) throws UserException;
	
	 User fetchUserById(int user_id) throws UserException;
	 
	 User validate(Login login);
	
	 public Collection<User> fetchAllUsers();

	void deleteUserById(int userId) throws UserException;
	
	void updateUser(User user) throws UserException;
	
}
