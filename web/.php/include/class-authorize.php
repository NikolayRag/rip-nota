<?
include('.php/sqTmpl/SQLTLogon.php');

// For Support visit http://sourceforge.net/projects/uflex/support
// ---------------------------------------------------------------------------
// 	  uFlex - An all in one authentication system PHP class
//    Copyright (C) 2011  Pablo Tejada
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see http://www.gnu.org/licenses/gpl-3.0.html.
// ---------------------------------------------------------------------------

/*Thought the Class Official name is userFlex the object is simply named uFlex*/
class uFlex {
    //End of constants\\\\
    var $db;
    var $id;        //Signed user ID
    var $sid;       //Current User Session ID
    var $username;  //Signed username
    var $pass;      //Holds the user password hash
    var $signed;    //Boolean, true = user is signed-in
    var $data;      //Holds entire user database row
    var $console;   //Cotainer for errors and reports
    var $log;       //Used for traking errors and reports
    var $confirm;   //Holds the hash for any type of comfirmation
    var $tmp_data;  //Holds the temporary user information during registration
    var $opt = array( //Array of Internal options
        "default_user" => array(
                "username" => "Guest",
                "user_id" => 0,
                "password" => 0,
                "signed" => false,
                "first_name" => ""
                )
        );
    var $validations = array( //Array for default field validations
            "username" => array(
                    "limit" => "3-15",
                    "regEx" => "/^([a-zA-Z0-9_])+$/"
                    ),
            "password" => array(
                    "limit" => "3-15",
                    "regEx" => false
//                    ),
//            "email" => array(
//                    "limit" => "4-45",
//                    "regEx" => "/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/"
                    )
        );
        
	var $encoder = array(
			"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
			"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
			0,2,3,4,5,6,7,8,9
		);
    
        
///////////////////////////////////////////////////////////////////////////////////////////////////////
/*
Register A New User
-Takes two parameters, the first being required
	@info = array object (takes an associatve array, 
				the index being the fieldname(column in database) 
				and the value its content(value)
	+optional second parameter
	@activation = boolean(true/false)
		default = false 
Returns activation hash if second parameter @activation is true
Returns true if second parameter @activation is false
Returns false on Error
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////
    function register($info,$activation = false){
        $this->logger("registration"); //Index for Errors and Reports

        //Saves Registration Data in Class
        $this->tmp_data = $info;

        //Validate All Fields
        if(
            !isset($info['username'])
            || !isset($info['password'])
            || !$this->validateAll()
        ) return false; //There are validations error

        //Built in actions for special fields
        //Hash Password
        $this->pass= $this->hash_pass($info['password']);
        $info['password'] = $this->pass;

        //Check for Email in database
//        if(isset($info['email']))
//            if($this->check_field('email',$info['email'],"This Email is Already in Use"))
//                return false;

        //Check for username in database
        $this->db->apply('logonRegisterCheck', $info['username']);
        if($this->db->fetch(0))
          return false;

        //Check for errors
        if($this->has_error()) return false;

        //User Activation
        if(!$activation){ //Activates user upon registration
            $info['activated'] = 1;
        }

        //Enter New user to Database
        if($this->db->apply('logonRegister', $info['username'], $info['password'], $info['activated'])){
            $this->report("New User \"{$info['username']}\" has been registered");
            $this->id = $this->db->lastInsertId();
            if($activation){
                //Insert Validation Hash
                $this->make_hash($this->id);
                $this->save_hash();
                return $this->confirm;
            }
            return true;
        }else{
//            $this->error(1);
            return false;
        }
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////
/*
Similar to the register method function in structure
This Method validates and updates any field in the database
-Takes one parameter
	@info = array object (takes an associatve array, 
				the index being the fieldname(column in database) 
				and the value its content(value)
On Success returns true
On Failure return false	
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////
    function update($info){
        $this->logger("update"); //Index for Errors and Reports

        //Saves Updates Data in Class
        $this->tmp_data = $info;

        //Validate All Fields
        if(!$this->validateAll()) return false; //There are validations error

        //Built in actions for special fields
        //Hash Password
        if(isset($info['password'])){
            $this->pass= $this->hash_pass($info['password']);
            $info['password'] = $this->pass;
        }
        //Check for Email in database
//        if(isset($info['email']))
//            if($this->check_field('email',$info['email'],"This Email is Already in Use"))
//                return false;

        //Check for errors
        if($this->has_error()) return false;

        //Check for Changes
//todo: INCONSTISTENT, do use db. Use versions
        if($this->db->apply('logonUpdate',1,2,$this->id)){
            $this->report("Information Updated");
            $_SESSION['nota']['update'] = true;
            return true;
        }else{
            $this->error(2);
            return false;
        }
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////
/*
Adds validation to queue for either the Registration or Update Method
Single Entry:
	Requires the first two parameters
		@name  = string (name of the field to be validated)
		@limit = string (range in the format of "5-10")
			*to make a field optional start with 0 (Ex. "0-10")
	Optional third paramenter
		@regEx = string (Regular Expresion to test the field)
_____________________________________________________________________________________________________

Multiple Entry:
	Takes only the first argument
		@name = Array Object (takes an object in the following format:
			array(
				"username" => array(
						"limit" => "3-15",
						"regEx" => "/^([a-zA-Z0-9_])+$/"
						),
				"password" => array(
						"limit" => "3-15",
						"regEx" => false
						)
				);
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////
    function addValidation($name,$limit = "0-1",$regEx = false){
        $this->logger("registration");
        if(is_array($name)){
            if(!is_array($this->validations))
                $this->validations = array(); //If is not an array yet, make it one
            $new = array_merge($this->validations,$name);
            $this->validations = $new;
            $this->report("New Validation Object added");
        }else{
            $this->validations[$name]['limit'] = $limit;
            $this->validations[$name]['regEx'] = $regEx;
            $this->report("The $name field has been added for validation");
        }
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////	
/*
Activates Account with hash
Takes Only and Only the URL c parameter of the comfirmation page
	@hash = string
Returns true on account activation and false on failure
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////
    function activate($hash){
        $this->logger("activation");

        if(!$this->check_hash($hash)) return false;

        if($this->db->apply('logonActivate', $hash, $this->id)){
            $this->report("Account has been Activated");
            return true;
        }else{
            $this->error(3);
            return false;
        }
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////
/*
Method to reset password, sents an email with a confirmation code to reset password
-Takes one parameter and is required
	@email = string(user email to reset password)
On Success it returns a hash which could then be use to construct the confirmation URL
On Failure it returns false
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////
    function pass_reset($email){
        $this->logger("pass_reset");

        $this->db->apply('logonPassReset', $email);
        $user = $this->db->fetch();

        if($user){
        	if(!$user['activated'] and !$user['confirmation']){
        		//The Account has been manually disabled and can't reset password
        		$this->error(9);
				return false;
        	}
        	
            $this->make_hash($user['user_id']);
            $this->id = $user['user_id'];
            $this->save_hash();

            $data = array("email" => $email,"username" => $user['username'],"user_id" => $user['user_id'],
                "hash" => $this->confirm);
            return $data;
        }else{
            $this->error(4);
            return false;
        }
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////
/*
Changes a Password with a Confirmation hash from the pass_reset method
*this is for users that forget their passwords to change the signed user password use ->update()
-Takes two parameters
	@hash = string (pass_reset method hash)
	@new = array (an array with indexes 'password' and 'password2')
					Example:
					array(
						[password] => pass123
						[password2] => pass123
					)
					*use ->addValidation('password', ...) to validate password
Returns true on a successfull password change
Returns false on error
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////
    function new_pass($hash,$newPass){
        $this->logger("new_pass");

        if(!$this->check_hash($hash)) return false;
        
        $this->tmp_data = $newPass;
        if(!$this->validateAll()) return false; //There are validations error

        $this->pass= $this->hash_pass($newPass['password']);

        if($this->db->apply('logonPassNew', $this->$pass, $hash, $this->id)){
            $this->report("Password has been changed");
            return true;
        }else{
            //Error
            $this->error(5);
            return false;
        }
    }

 /*////////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*\
////////Private and Secondary Methods below this line\\\\\\\\\\\\\
 \*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\/////////////////////////////////////////////*/
/*Object Constructure*/
    function __construct($user = false,$pass = false,$auto = false){
        global $DB;
        $this->db= $DB;

        $this->logger("login"); //Index for Reports and Errors;
        $this->sid = session_id();

        $result = $this->login($user,$pass,$auto);
        if($result == false){
            $_SESSION['nota'] = $this->opt['default_user'];
            $this->update_from_session();
            $this->report("User is " + $this->username);
        }else{
            if(!$auto and isset($_SESSION['nota']['remember'])){
                unset($_SESSION['nota']['remember']);
                $this->setCookie();
            }
        }

        return true;
    }

    private function login($user = false,$pass = false,$auto = false){
        global $AUTHORIZE;
        //Session Login
        if(array_key_exists('nota', $_SESSION) && @$_SESSION['nota']['signed']){
            $this->report("User Is signed in from session");
            $this->update_from_session();
            if(isset($_SESSION['nota']['update'])){
                $this->report("Updating Session from database");
                //Get User From database because its info has change during current session
                $this->db->apply('logonInById', $this->id);
                $update = $this->db->fetch();
                $this->update_session($update);
                $this->log_logon(); //Update last_login
            }
            return true;
        }
        if(isset($_COOKIE[$AUTHORIZE->COOKIENAME]) and !$user and !$pass){
            //Cookies Login
            $c = $_COOKIE[$AUTHORIZE->COOKIENAME];
            $this->report("Attemping Login with cookies");
            if($this->check_hash($c,true)){
                $auto = true;
                $user= $this->username;
                $byName= true;
            }else{
                $this->error(6);
                $this->logout(true);
                return false;
            }
        }else{
            //Credentials Login
            if($user && $pass){
//ki+
                if(isSet($this->validations['email']) and preg_match($this->validations['email']['regEx'],$user)){
                    //Login using email
                    $byName= false;
                }else{
                    //Login using username
                    $byName= true;
                    
                }
                $this->pass= $this->hash_pass($pass);
                $this->report("Credentials received");
            }else{
                $this->error(7);
                return false;
            }
        }


        $this->report("Querying Database to authenticate user");
        //Query Database and check login
        $this->db->apply($byName?'logonInByName':'logonInByMail', $user, $this->pass);
        $userFile = $this->db->fetch();
        if($userFile){ //success
            //If Account is not Activated
            if($userFile['activated'] == 0){
                if($userFile['last_login'] == 0){
                    //Account has not been activated
                    $this->error(8);
                }else if(!$userFile['confirmation']){
                    //Account has been deactivated
                    $this->error(9);
                }else{
                	//Account deativated due to a password reset or reactivation request
                	$this->error(14);
                }
                return false;
            }
            //Account is Activated and user is logged in
            $this->update_session($userFile);

            //If auto Remember User
            if($auto){
                $this->setCookie();
            }
            $this->log_logon(); //Update last_login
            //Done
            $this->report("User Logged in Successfully");
            return true;
        }else{ //fail
            if(isset($_COOKIE[$AUTHORIZE->COOKIENAME])){
                $this->logout(true);
            }
            $this->db->apply('logonRegisterCheck', $user);
            if(!$this->db->fetch(0))
              $this->error(15); //name available, procceed register
		    else {
                $this->log_logon(1,0);
                $this->error(10);
            }
	        return false;
        }
    }

    function logout($_badlogin = false){
        $this->log_logon($_badlogin, !$_badlogin);

        global $AUTHORIZE;
        $this->logger("login");
        $this->signed = 0;
		//Import default user object
		$this->data = $_SESSION['nota'] = $this->opt['default_user'];
        if(!setcookie($AUTHORIZE->COOKIENAME,'',time() - 3600,'/')){
            $this->report("The Autologin cookie could not be deleted");
        }
        $this->report("User Logged out");
    }

    private function log_logon($_in= true, $_ok= true){
        global $httpId;
        if($this->db->apply('logonLog', $this->id?$this->id:0, $httpId, $_in?1:0, $_ok?1:0))
          $this->report("Last Login updated");
    }

    function getCookie(){
        if($this->pass and $this->id)
            echo $this->make_hash($this->id,$this->pass);
    }

    function setCookie(){
        if($this->pass and $this->id)
          $this->report("Cookies have been updated for auto login");
        else
          $this->error("Info required to set the cookie is not available");
    }

    private function update_session($d){
        unset($_SESSION['nota']['update']);

        $_SESSION['nota'] = $d;
        $_SESSION['nota']['signed'] = 1;

        $this->report("Session updated");
        $this->update_from_session();
    }

    private function update_from_session(){
        $d = $_SESSION['nota'];

        $this->id = $d['user_id'];
        $this->data = $d;
        $this->username = $d['username'];
        $this->pass = $d['password'];
        $this->signed = $d['signed'];

        $this->report("Session has been imported to the object");
    }

    function hash_pass($pass){
        global $SITECFG;
        return md5($SITECFG->salt.$pass.$SITECFG->salt);
    }

    function logger($log){
        $this->log = $log;
        unset($this->console['errors'][$log]);
        unset($this->console['form'][$log]);
        $this->report(">>Startting new $log request");
    }

    function report($str = false){
        $index = $this->log;
        if($str){
            $str = ucfirst($str);
            $this->console['reports'][$index][] = $str; //Strore Report
        }else{
            if($index){
                return $this->console['reports'][$index]; //Return the $index Reports Array
            }else{
                return $this->console['reports']; //Return the Full Reports Array
            }
        }
    }

    function error($str = false){
        $index = $this->log;
        if($str){
            $this->console['errors'][$index][] = $str; //Store Error
            $this->report("Error: {$str}"); //Report The error				
        }else{
            if($index){
                if(!isset($this->console['errors'][$index]))
                    return false;
                return $this->console['errors'][$index]; //Return the $index Errors Array
            }else{
                return $this->console['errors']; //Return the Full Error Array
            }
        }
    }

    //Adds fields with errors to the console
    function form_error($field = false,$error = false){
        $index = $this->log;
        if($field){
            if($error){
                $this->console['form'][$index][$field] = $error;
                $this->error($error);
            }else{
                $this->console['form'][$index][] = $field;
            }
        }else{
            if($index){
                if(!isset($this->console['form'][$index]))
                    return false;
                return $this->console['form'][$index]; //Return the $index Errors Array
            }else{
                return $this->console['form']; //Return the Full form Array
            }
        }
    }

    //Check for errors in the console
    function has_error($index = false){
        //Check for errors
        $index = $index?$index:$this->log;
        $count = array_key_exists($index, $this->console['errors']) && count($this->console['errors'][$index]);
        if($count){
            $this->report("$count Error(s) Found!");
            return true;
        }else{
            $this->report("No Error Found!");
            return false;
        }
    }

    //Generates a unique comfirm hash
    function make_hash($uid,$hash = false){
        $e_uid = $this->encode($uid);
        $e_uid_length = strlen($e_uid);
        $e_uid_length = str_pad($e_uid_length,2,0,STR_PAD_LEFT);
        $e_uid_pos = rand(10,32 - $e_uid_length - 1);

        if(!$hash){
            $hash = md5(uniqid(rand(),true));
        }
        //$code = substr($code, 0, $length);
        $code = $e_uid_pos.$e_uid_length;
        $code .= substr($hash,0,$e_uid_pos - strlen($code));
        $code .= $e_uid;
        $code .= substr($hash,strlen($code));

        $this->confirm = $code;
        return $code;
    }

    //Validates a confirmation hash
    function check_hash($hash,$bypass = false){
        if(strlen($hash) != 32 || !preg_match("/^[0-9]{4}/",$hash)){
            $this->error(11);
            return;
        }

        $e_uid_pos = substr($hash,0,2);
        $e_uid_length = substr($hash,2,2);
        $e_uid = substr($hash,$e_uid_pos,$e_uid_length);

        $uid = $this->decode($e_uid);


        //Bypass hash confirmation and get the user by partially matching its password
        if($bypass){
            preg_match("/^([0-9]{4})(.{2,".($e_uid_pos - 4)."})(".$e_uid.")/",$hash,$exerpt);
            $pass = $exerpt[2];
            $this->db->apply('logonHashPass', $uid, "$pass%");
        } else
            $this->db->apply('logonHashPass', $uid, $hash);

        $result = $this->db->fetch();

        if(!$result){
            $this->report("The user ID and the confirmation hash did not match");
            $this->error(12);
            return false;
        }
        if($this->signed and $this->id == $result['user_id']){
            $this->logout(true);
        }

        //Hash is valid import user's info to object
        $this->data = $result;
        $this->id = $result['user_id'];
        $this->username = $result['username'];
        $this->pass = $result['password'];

        $this->report("Hash successfully validated");
        return true;
    }

    //Saves the confirmation hash in the database
    function save_hash(){
        if($this->confirm and $this->id){
            if(!$this->db->apply('logonRegisterConfirm', $this->confirm, $this->id)){
                $this->error(13);
                return false;
            }else{
                $this->report("Confirmation hash has been saved");
            }
        }else{
            $this->report("Can't save Confirmation hash");
            return false;
        }
        return true;
    }

    //Validates All fields in ->tmp_data array
    private function validateAll(){
        $info = $this->tmp_data;
        foreach($info as $field => $val){
            //Match double fields
            if(isset($info[$field.(2)])){
                if($val != $info[$field.(2)]){
                    $this->form_error($field, ucfirst($field) . "s did not matched");
                    //return false;
                }else{
                    $this->report(ucfirst($field) . "s matched");
                }
            }

            $this->tmp_data[$field] = trim($val); //Trim white spaces at end and start

            //Validate field
            if(!isset($this->validations[$field]))
                continue;
            $opt = $this->validations[$field];
            $this->validate($field,$opt['limit'],$opt['regEx']);
        }
        return $this->has_error() ? false : true;
    } 

    //Validates field($name) in tmp_data
    private function validate($name,$limit,$regEx = false){
        $Name = ucfirst($name);
        $str = $this->tmp_data[$name];
        $l = explode("-",$limit);
        $min = intval($l[0]);
        $max = intval($l[1]);
        if(!$max and !$min){
            $this->error("Invalid second paramater for the $name validation");
            return false;
        }
        if(!$str){
            if(!isset($this->tmp_data[$name])){
                $this->report("missing index $name from the POST array");
            }
            if(strlen($str) == $min){
                $this->report("$Name is blank and optional - skipped");
                return true;
            }
            $this->form_error($name,"$Name is required.");
            return false;
        }
        if(strlen($str) > $max){
            $this->form_error($name,"The $Name is larger than $max characters.");
            return false;
        }
        if(strlen($str) < $min){
            $this->form_error($name,"The $Name is too short. it should at least be $min characters long");
            return false;
        }
        if($regEx){
            preg_match_all($regEx,$str,$match);
            if(count($match[0]) != 1){
                $this->form_error($name,"The $Name \"{$str}\" is not valid");
                return false;
            }
        }

        $this->report("The $name is Valid");
        return true;
    }

	//NEW uFlex 0.41
	//Encoder
	function encode($d){
		$k=$this->encoder;preg_match_all("/[1-9][0-9]|[0-9]/",$d,$a);$n="";$o=count($k);
        foreach ($a[0]as$i) if ($i<$o) $n.=$k[$i]; else $n.="1".$k[$i-$o];
		return $n;
	}
	//Decoder
	function decode($d){
		$k=$this->encoder;preg_match_all("/[1][a-zA-Z]|[2-9]|[a-zA-Z]|[0]/",$d,$a);$n="";$o=count($k);
        foreach ($a[0]as$i){ $f=preg_match("/1([a-zA-Z])/",$i,$v); if($f==true) $i=$o+array_search($v[1],$k); else $i=array_search($i,$k); $n.=$i;}
		return $n;
	}	
}

?>