/**
 * Utility functions for date formatting
 */

/**
 * Formats a date string to display with abbreviated month (mmm format)
 * @param dateString - The date string to format (e.g., "October 2024", "2024-10", etc.)
 * @returns Formatted date string (e.g., "Oct 2024")
 */
export const formatDateMMM = (dateString: string): string => {
  if (!dateString) return "";

  try {
    // Handle different date formats
    let date: Date;

    // If it's already in a readable format like "October 2024", try to parse it
    if (dateString.includes(" ")) {
      date = new Date(dateString);
    } else if (dateString.includes("-")) {
      // Handle YYYY-MM format
      date = new Date(dateString + "-01"); // Add day for proper parsing
    } else {
      // Fallback
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) {
      return dateString; // Return original if parsing fails
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  } catch (error) {
    console.warn("Failed to format date:", dateString, error);
    return dateString;
  }
};

/**
 * Parses various date formats and returns a standardized YYYY-MM format
 * @param dateString - The date string to parse
 * @returns Standardized date string in YYYY-MM format
 */
export const parseDateToYYYYMM = (dateString: string): string => {
  if (!dateString) return "";

  try {
    let date: Date;

    // If it's already in YYYY-MM format
    if (/^\d{4}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // If it's in a readable format like "October 2024"
    if (dateString.includes(" ")) {
      date = new Date(dateString);
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) {
      return dateString;
    }

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  } catch (error) {
    console.warn("Failed to parse date:", dateString, error);
    return dateString;
  }
};

/**
 * Formats a date string to display detailed information including day, month, year, time, and timezone
 * @param dateString - The date string to format
 * @returns Formatted date string with full details (e.g., "25 Dec 2025 10:30:45 UTC")
 */
export const formatDateDetailed = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return dateString; // Return original if parsing fails
    }

    // Format: "25 Dec 2025 10:30:45 UTC"
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };

    return date.toLocaleString("en-US", options);
  } catch (error) {
    console.warn("Failed to format date:", dateString, error);
    return dateString;
  }
};
