class NotificationController {
  async store(request, response) {
    return response.json(request.body);
  }
}

export default new NotificationController();
