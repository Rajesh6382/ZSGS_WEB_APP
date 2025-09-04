document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('jobRegistrationForm');
    
    // Validation patterns
    const patterns = {
        name: /^[a-zA-Z\s]{2,30}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[6-9]\d{9}$/,
        pincode: /^[1-9][0-9]{5}$/,
        salary: /^\d+(\.\d{1,2})?$/
    };

    // File size limits (in bytes)
    const fileSizeLimits = {
        resume: 5 * 1024 * 1024, // 5MB
        panCard: 2 * 1024 * 1024, // 2MB
        aadharCard: 2 * 1024 * 1024, // 2MB
        photo: 1 * 1024 * 1024, // 1MB
        certificates: 5 * 1024 * 1024 // 5MB per file
    };

    // Real-time validation for each field
    const fields = [
        'firstName', 'lastName', 'email', 'phone', 'dob', 'gender',
        'address', 'city', 'pincode', 'position', 'experience',
        'qualification', 'expectedSalary', 'resume', 'panCard',
        'aadharCard', 'photo', 'certificates', 'terms'
    ];

    fields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', () => validateField(fieldName));
            field.addEventListener('change', () => validateField(fieldName));
        }
    });

    // Validate individual field
    function validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Clear previous styling
        field.classList.remove('error', 'success');

        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (!value) {
                    errorMessage = `${fieldName === 'firstName' ? 'First' : 'Last'} name is required`;
                    isValid = false;
                } else if (!patterns.name.test(value)) {
                    errorMessage = 'Name should contain only letters and spaces (2-30 characters)';
                    isValid = false;
                }
                break;

            case 'email':
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!patterns.email.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;

            case 'phone':
                if (!value) {
                    errorMessage = 'Phone number is required';
                    isValid = false;
                } else if (!patterns.phone.test(value)) {
                    errorMessage = 'Please enter a valid 10-digit Indian phone number';
                    isValid = false;
                }
                break;

            case 'dob':
                if (!value) {
                    errorMessage = 'Date of birth is required';
                    isValid = false;
                } else {
                    const today = new Date();
                    const birthDate = new Date(value);
                    const age = today.getFullYear() - birthDate.getFullYear();
                    
                    if (age < 18 || age > 65) {
                        errorMessage = 'Age must be between 18 and 65 years';
                        isValid = false;
                    }
                }
                break;

            case 'gender':
            case 'experience':
            case 'qualification':
                if (!value) {
                    errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
                    isValid = false;
                }
                break;

            case 'address':
                if (!value) {
                    errorMessage = 'Address is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Please enter a complete address (minimum 10 characters)';
                    isValid = false;
                }
                break;

            case 'city':
                if (!value) {
                    errorMessage = 'City is required';
                    isValid = false;
                } else if (!patterns.name.test(value)) {
                    errorMessage = 'Please enter a valid city name';
                    isValid = false;
                }
                break;

            case 'pincode':
                if (!value) {
                    errorMessage = 'Pincode is required';
                    isValid = false;
                } else if (!patterns.pincode.test(value)) {
                    errorMessage = 'Please enter a valid 6-digit pincode';
                    isValid = false;
                }
                break;

            case 'position':
                if (!value) {
                    errorMessage = 'Position is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Position must be at least 2 characters long';
                    isValid = false;
                }
                break;

            case 'expectedSalary':
                if (!value) {
                    errorMessage = 'Expected salary is required';
                    isValid = false;
                } else if (!patterns.salary.test(value) || parseFloat(value) <= 0) {
                    errorMessage = 'Please enter a valid salary amount';
                    isValid = false;
                }
                break;

            case 'resume':
            case 'panCard':
            case 'aadharCard':
            case 'photo':
                isValid = validateFileField(field, fieldName, errorElement);
                break;

            case 'certificates':
                // Optional field - only validate if files are selected
                if (field.files.length > 0) {
                    isValid = validateFileField(field, fieldName, errorElement);
                }
                break;

            case 'terms':
                if (!field.checked) {
                    errorMessage = 'You must agree to the terms and conditions';
                    isValid = false;
                }
                break;
        }

        // Update UI based on validation result
        if (fieldName !== 'terms') {
            if (isValid) {
                field.classList.add('success');
                errorElement.textContent = '';
            } else {
                field.classList.add('error');
                errorElement.textContent = errorMessage;
            }
        } else {
            errorElement.textContent = errorMessage;
        }

        return isValid;
    }

    // Validate file fields
    function validateFileField(field, fieldName, errorElement) {
        const files = field.files;
        let isValid = true;
        let errorMessage = '';

        if (files.length === 0 && field.hasAttribute('required')) {
            errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
            isValid = false;
        } else if (files.length > 0) {
            const file = files;
            const fileSize = file.size;
            const fileName = file.name.toLowerCase();
            
            // Check file size
            if (fileSize > fileSizeLimits[fieldName]) {
                const maxSizeMB = fileSizeLimits[fieldName] / (1024 * 1024);
                errorMessage = `File size must be less than ${maxSizeMB}MB`;
                isValid = false;
            }
            
            // Check file type based on field
            if (isValid) {
                switch (fieldName) {
                    case 'resume':
                        if (!fileName.match(/\.(pdf|doc|docx)$/)) {
                            errorMessage = 'Resume must be in PDF, DOC, or DOCX format';
                            isValid = false;
                        }
                        break;
                    case 'panCard':
                    case 'aadharCard':
                    case 'certificates':
                        if (!fileName.match(/\.(pdf|jpg|jpeg|png)$/)) {
                            errorMessage = 'File must be in PDF, JPG, or PNG format';
                            isValid = false;
                        }
                        break;
                    case 'photo':
                        if (!fileName.match(/\.(jpg|jpeg|png)$/)) {
                            errorMessage = 'Photo must be in JPG or PNG format';
                            isValid = false;
                        }
                        break;
                }
            }
        }

        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
        
        return isValid;
    }

    // Replace the existing form submission event listener with this updated version

// Form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isFormValid = true;
    
    // Validate all fields
    fields.forEach(fieldName => {
        const fieldValid = validateField(fieldName);
        if (!fieldValid) {
            isFormValid = false;
        }
    });

    if (isFormValid) {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Simulate form submission delay
        setTimeout(() => {
            // Generate application ID
            const applicationId = 'JOB' + Date.now().toString().slice(-6);
            document.getElementById('applicationId').textContent = applicationId;
            
            // Show success card
            showSuccessCard();
            
            // Reset submit button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Here you would typically send the form data to a server
            console.log('Form data:', new FormData(form));
            console.log('Application ID:', applicationId);
            
        }, 1500); // 1.5 second delay to simulate server processing
        
    } else {
        alert('Please correct the errors in the form before submitting.');
        
        // Scroll to first error
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// Add these new functions to script.js

function showSuccessCard() {
    const overlay = document.getElementById('successOverlay');
    const container = document.querySelector('.container');
    
    // Dim the form background
    container.classList.add('form-hidden');
    
    // Show success overlay
    overlay.classList.add('show');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeSuccessCard() {
    const overlay = document.getElementById('successOverlay');
    const container = document.querySelector('.container');
    
    // Hide success overlay
    overlay.classList.remove('show');
    
    // Restore form visibility
    container.classList.remove('form-hidden');
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
    
    // Optional: Reset form after closing success card
    setTimeout(() => {
        form.reset();
        // Clear all error messages and styling
        fields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const errorElement = document.getElementById(fieldName + 'Error');
            
            if (field) {
                field.classList.remove('error', 'success');
            }
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    }, 300);
}

function submitAnotherApplication() {
    closeSuccessCard();
    // Form will be automatically reset when the success card closes
}

// Close success card when clicking outside of it
document.getElementById('successOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeSuccessCard();
    }
});

// Close success card with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('successOverlay');
        if (overlay.classList.contains('show')) {
            closeSuccessCard();
        }
    }
});

});
