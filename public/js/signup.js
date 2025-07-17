// Generate a numeric OTP
function generateNumericOTP(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString().substring(0, length);
}

// Generates OTP with expiry
function generateOTPWithExpiry() {
  const otp = generateNumericOTP();
  const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes
  return { otp, expiryTime };
}

// Checks if OTP is expired
function isOTPExpired(otpData) {
  return Date.now() > otpData.expiryTime;
}

// Compares user input with stored OTP
function isOTPValid(userInput, otpData) {
  if (isOTPExpired(otpData)) {
    return { success: false, message: "OTP has expired" };
  }

  if (userInput === otpData.otp) {
    return { success: true, message: "OTP is valid" };
  } else {
    return { success: false, message: "OTP is incorrect" };
  }
}

// Example usage:

// Generate and store OTP (you might want to save this to session or DB)
const storedOTPData = generateOTPWithExpiry();
console.log("Generated OTP:", storedOTPData.otp);

// Simulate user input from a form (replace with real input)
const userInput = prompt("Enter your OTP:");

// Validate the input
const result = isOTPValid(userInput, storedOTPData);
console.log(result.message);