export async function POST(req: Request) {
  try {
    const { userId, userEmail, rating, category, subject, message } = await req.json()

    // Validate required fields
    if (!rating || !category || !subject || !message) {
      return Response.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return Response.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Log feedback (in production, save to database)
    console.log("Feedback submission:", {
      userId,
      userEmail,
      rating,
      category,
      subject,
      message,
      timestamp: new Date().toISOString(),
      to: "info@horizonflare.in",
    })

    // Here you would:
    // 1. Save to database
    // 2. Send email notification to support team
    // 3. Integrate with feedback management system

    // Example email content for support team:
    /*
    await emailService.send({
      to: "info@horizonflare.in",
      subject: `HorizonTalk Feedback: ${subject}`,
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>User:</strong> ${userEmail} (${userId})</p>
        <p><strong>Rating:</strong> ${rating}/5 stars</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `
    })
    */

    return Response.json({
      success: true,
      message: "Thank you for your feedback!",
    })
  } catch (error) {
    console.error("Feedback submission error:", error)
    return Response.json({ error: "Failed to submit feedback. Please try again." }, { status: 500 })
  }
}
