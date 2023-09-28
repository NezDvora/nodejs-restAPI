import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactPath = path.resolve("models", "contacts.json");

const updateContactsFile = async (contacts) => {
  try {
    await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));
  } catch (error) {
    throw error;
  }
};

export const listContacts = async () => {
  try {
    const data = await fs.readFile(contactPath);
    return JSON.parse(data);
  } catch (error) {
    throw error;
  }
};

export const getContactById = async (contactId) => {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId) || null;
};

export const addContact = async (body) => {
  const { name, email, phone } = body;
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await updateContactsFile(contacts);
  return newContact;
};

export const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) return null;
  contacts[index] = { ...contacts[index], ...body };
  await updateContactsFile(contacts);
  return contacts[index];
};

export const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) return null;
  const [result] = contacts.splice(index, 1);
  await updateContactsFile(contacts);
  return result;
};
