# Bulk Edit / Domain Events 

This is a very rough breakdown on how the BulkUpload system works.

The main players in this dance are highlighted below.

*(?) these are assumptions that need to be proven / updated.*


## DomainEvent

The application has a DomainEvent object and collection that seems to capture all of the events that you will process via the PMSRequest process (?).

Domain events are effectively an object collection that relate to the type of request and its associated data.  By calling publish a domain event with an object, other injected domain event object can look in to these details.

>**For example**
>
>The Item class has a method Update.  This does some validation and then calls a publish with an ItemEditedEvent
>
>The PMSRequestCreationService later passes this to the PMS specific creation services (See MerlinRequestCreationService)
 
All domain event class implement IDomainEvent, the DomainEventTracker maintains a collection IDomainEvents (of)

 - ItemCreatedEvent
 - ItemEditedEvent
 - DeviationEditedEvent
 - TreatmentTypeDeviationEditedEvent
 - SupplierListApprovedEvent
 - SiteMadeLiveEvent

The main purpose of this seems to be to capture the events for later persistence in the PMSRequest / PMSRequestJobs tables.

## ItemBulkEditBackgroundJob

This class takes the Items and BulkEditItems and marries them up, persists the changes to the database. It then creates the PMSRequest entries that are later picked up via the background tasks.

## ScheduleBulkEditService 

This class creates the Hangfire job and updates the BulkEdit row with the Hangfire Id and Schedule.

# System Startup

When the application starts the following are registered for Dependency Injection:

 - services.AddScoped< IDomainEvents, DomainEventsTracker >();
 - All items flagged as having the Attribute [Service]
    ScheduleBulkEditService

When the application starts the following are registered for Background Tasks (Hosted Service):

```
services.AddHostedService<PmsRequestQueueProcessor>();
```

The application uses a background scheduling system for scheduling tasks.

> This is registered at startup via "services.AddHostedService< PmsRequestQueueProcessor >();", this task scheduler is baked into the .Net framework. 
>
>Background tasks with hosted services in ASP.NET Core. In ASP.NET Core, background tasks can be implemented as hosted services. A hosted service is a class with background task logic that implements the IHostedService interface. BackgroundService is a base class for implementing a long running IHostedService.
>
>[https://www.youtube.com/watch?v=M3qS73D-Vuc](Worker Services in .NET Core (Background Services))


# BulkEdit Walkthrough

User uploads a bulk edit

This process calls the UploadItemBulkEdit which has the following tasks ..

- User is validated
- Libraries are validated
- File is parsed
- BulkEdit is created
- ScheduleBulkEditService is called to setup hangfire (ScheduleBulkEditService)

**ScheduleBulkEditService**
```
    ScheduleBulkEditService.ScheduleItemBulkEdit

        This orchestrates ..

            Schedule date time generation
            Hangfire job creation with function to run the "RunItemBulkEdit" function
            Updates the BulkEditItem with the Hangfire Job ID / Schedule
```

**RunItemBulkEdit Function**

```
    Executed by Hangfire, either manually or via the schedule created in "ScheduleBulkEditService"

    This function orchestrates ..

        Retrieves all items based on the BulkEditId
        
        For each Item
            Updates the item using the data from the BulkEditItem (ItemBulkEdits -> ItemBulkEditLines)
            Publish a Domain event "ItemEditedEvent" for the Item changed
        
        Set the ItemBulkEdit as complete

        Creates the PMSRequest for the BulkEdit
```        

**CreatePmsRequests**

```
    This orchestrates ..

        Add the domain events to the PMSRequest table
        Creates the PMSRequest for the BulkEdit
        Creates the PMSRequestJob for the BulkEdit
        Create a PMSRequestJob

        This PMSRequest is then later picked up via the Background Task (IHostedService Process)
```

**IHostedService PmsRequestQueue**

This allows the application to fire of a process every x(?) minutes to get all PMSRequests for the BulkdEdit, getting all items that are "Queued" in the PMSRequests Table.

The Task process setup and execution is located in
>Ivc.Pacman.Web.Infrastructure.Pms.Request.Queue

This will pick up the Requests to process and then send them onto 
>Ivc.Pacman.Web.Infrastructure.Pms.Request.Send

where the correct function is executed.