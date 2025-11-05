# Resume Builder Application

A modern, feature-rich React application for creating, editing, and managing professional resumes with advanced PDF export functionality.

## Features

### ✨ Core Functionality

- **Interactive Resume Builder**: Create and edit resumes with a user-friendly interface
- **Real-time Preview**: See changes instantly with accurate page break visualization
- **Professional PDF Export**: Export your resume as a perfectly formatted PDF document
- **Local Database**: All data is stored locally using IndexedDB (via Dexie)
- **Redux State Management**: Robust state management for all resume data

### 📝 Editable Sections

- **Contact Information**: Name, phone, email, LinkedIn, professional tagline
- **Work Experience**: Company, position, dates, descriptions, responsibilities
- **Projects**: Title, subtitle, description, technologies, responsibilities
- **Skills**:
  - Technical skills with proficiency level bars
  - Additional skills as bullet points
  - Edit and delete functionality for both types
- **Education**: Institution, degree, location, dates, descriptions
- **Awards & Certifications**:
  - Title, description, dates, issuing organization
  - Fully editable awards section
  - Professional formatting for certificates

### 🎨 Design Features

- **Professional Layout**: Based on modern resume templates
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Print-Friendly**: Optimized for PDF export and printing with proper page breaks
- **Clean UI**: Intuitive interface with modal-based editing
- **Page Break Preview**: Visual indicators for page breaks in preview mode
- **A4 Format**: Perfect formatting for standard resume size

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**

   ```bash
   cd Resume
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Start the development server**

   ```bash
   yarn start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

## How to Use

### 1. Load Sample Data

- Click the "Sample Data" button to populate the resume with example content
- This gives you a starting point based on the original template

### 2. Edit Contact Information

- Click "Contact" in the toolbar to edit your personal information
- Fill in your name, phone, email, LinkedIn profile, and professional tagline

### 3. Add Work Experience

- Click "+ Experience" to add a new job
- Fill in company, position, dates, description, and key responsibilities
- Use the "Currently working here" checkbox for your current job

### 4. Add Projects

- Click "+ Project" to add a new project
- Include title, subtitle, description, technologies used, and your role
- Add multiple responsibilities and technologies as needed

### 5. Add Skills

- Click "+ Skill" to add technical or additional skills
- Choose between "Technical Skill" (with progress bar) or "Additional Skill" (bullet point)
- Set proficiency levels for technical skills

### 6. Add Education & Awards

- Use "+ Education" and "+ Award" buttons to add academic background and achievements

### 7. Preview and Export

- Click "Preview" to see your resume in full-screen mode
- Click "Export PDF" to download your resume as a PDF file
- Use "Save" to store your resume locally

## Technical Architecture

### Frontend Stack

- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **Cloudscape Design System** for UI components
- **Dexie** for local IndexedDB database
- **html2pdf.js** for precise PDF generation
- **CSS Grid & Flexbox** for responsive layout

### Project Structure

```
src/
├── components/           # React components
│   ├── editors/         # Modal editors for different sections
│   ├── ResumeBuilder.tsx # Main application component
│   ├── ResumeDisplay.tsx # Resume preview component
│   └── Icon.tsx         # Simple icon component
├── store/               # Redux store and slices
├── services/            # Database and PDF export services
├── types/               # TypeScript type definitions
└── utils/               # Utility functions and sample data
```

### Key Features Implementation

#### Advanced PDF Export

- Precise A4 formatting
- Proper page breaks and content flow
- High-quality text and graphics rendering
- Professional margins and spacing

#### State Management

- Redux Toolkit for centralized state management
- Separate actions for each resume section (experience, projects, skills, etc.)
- Automatic timestamp updates on changes

#### Local Database

- Dexie wrapper around IndexedDB for persistent storage
- Automatic saving and loading of resume data
- Search functionality for multiple resumes

#### PDF Export

- html2pdf.js converts the resume display to PDF
- Optimized settings for professional document quality
- Maintains formatting and styling in exported PDF

## Customization

### Styling

- Edit CSS files in the components directory
- Modify `ResumeDisplay.css` for resume layout changes
- Update `ResumeBuilder.css` for application UI changes

### Adding New Sections

1. Add new types to `src/types/resume.ts`
2. Create Redux actions in `src/store/resumeSlice.ts`
3. Build editor component in `src/components/editors/`
4. Update `ResumeDisplay.tsx` to show the new section

### Sample Data

- Modify `src/utils/sampleData.ts` to change default content
- Update with your own information for quick testing

## Browser Compatibility

- Modern browsers with ES6+ support
- IndexedDB support required for local storage
- Print/PDF functionality works in all major browsers

## Troubleshooting

### Common Issues

1. **PDF Export Not Working**:
   - Ensure popup blockers are disabled
   - Check if content fits within page breaks
2. **Data Not Saving**: Check browser's IndexedDB permissions
3. **Styling Issues**: Clear browser cache and reload

### PDF Export Tips

- Use preview mode to check page breaks
- Adjust content to avoid awkward breaks
- Ensure all sections fit properly on pages

### Development

- Use browser developer tools to inspect Redux state
- Check IndexedDB in Application tab for stored data
- Console logs available for debugging PDF export

## Future Enhancements

- Multiple resume templates
- Cloud storage integration
- Resume sharing functionality
- Import from LinkedIn/other platforms
- Advanced formatting options

---

**Built with ❤️ using React, Redux, and modern web technologies**
