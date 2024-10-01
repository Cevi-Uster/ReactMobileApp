export type DropOutMessage = {
  isSending: boolean;
  stufe: string;
  destinationEmail: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  acceptance: boolean;
};